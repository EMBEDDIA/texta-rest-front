import {
  apply, applyTemplates,
  chain,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  Tree,
  url
} from '@angular-devkit/schematics';

import {basename, dirname, join, normalize, Path, strings, virtualFs, workspaces} from '@angular-devkit/core';
import {Schema} from './schema';

export interface Location {
  name: string;
  path: Path;
}

export enum ProjectType {
  Application = 'application',
  Library = 'library',
}

function createHost(tree: Tree): workspaces.WorkspaceHost {
  return {
    async readFile(path: string): Promise<string> {
      const data = tree.read(path);
      if (!data) {
        throw new Error('File not found.');
      }

      return virtualFs.fileBufferToString(data);
    },
    async writeFile(path: string, data: string): Promise<void> {
      return tree.overwrite(path, data);
    },
    async isDirectory(path: string): Promise<boolean> {
      // approximate a directory check
      return !tree.exists(path) && tree.getDir(path).subfiles.length > 0;
    },
    async isFile(path: string): Promise<boolean> {
      return tree.exists(path);
    },
  };
}

// tslint:disable-next-line:typedef
export async function getWorkspace(tree: Tree, path = '/') {
  const host = createHost(tree);

  const {workspace} = await workspaces.readWorkspace(path, host);

  return workspace;
}

/**
 * Build a default project path for generating.
 * @param project The project which will have its default path generated.
 */
export function buildDefaultPath(project: workspaces.ProjectDefinition): string {
  const root = project.sourceRoot ? `/${project.sourceRoot}/` : `/${project.root}/src/`;
  const projectDirName = project.extensions.projectType === ProjectType.Application ? 'app' : 'lib';

  return `${root}${projectDirName}`;
}

export async function createDefaultPath(tree: Tree, projectName: string): Promise<string> {
  const workspace = await getWorkspace(tree);
  const project = workspace.projects.get(projectName);
  if (!project) {
    throw new Error('Specified project does not exist.');
  }

  return buildDefaultPath(project);
}

export function parseName(path: string, name: string): Location {
  const nameWithoutPath = basename(normalize(name));
  const namePath = dirname(join(normalize(path), name) as Path);

  return {
    name: nameWithoutPath,
    path: normalize('/' + namePath),
  };
}

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function generateTextaModelModule(options: Schema): Rule {
  // tslint:disable-next-line:variable-name
  return async (_tree: Tree, _context: SchematicContext) => {
    if (options.path === undefined) {
      options.path = await createDefaultPath(_tree, options.project as string);
    }

    options.type = !!options.type ? `.${options.type}` : '';

    const parsedPath = parseName(options.path, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;

    const templateSource = apply(url('./files'), [
      applyTemplates({
        classify: strings.classify,
        dasherize: strings.dasherize,
        camelize: strings.camelize,
        name: options.name
      }),
      move((options.flat) ?
        normalize(options.path) :
        normalize(options.path + '/' + strings.dasherize(options.name)))
    ]);

    return chain([
      generateTaskServices(options),
      generateTaskTypes(options),
      mergeWith(templateSource)
    ]);
  };
}

export function generateTaskServices(options: Schema): Rule {
  // tslint:disable-next-line:variable-name
  return (_tree: Tree, _context: SchematicContext) => {

    const templateSource = apply(url('./services'), [
      applyTemplates({
        classify: strings.classify,
        dasherize: strings.dasherize,
        camelize: strings.camelize,
        name: options.name
      }),
      move('/src/app/core/models/' + strings.dasherize(options.name))
    ]);

    return mergeWith(templateSource);
  };
}

export function generateTaskTypes(options: Schema): Rule {
  // tslint:disable-next-line:variable-name
  return (_tree: Tree, _context: SchematicContext) => {

    const templateSource = apply(url('./types'), [
      applyTemplates({
        classify: strings.classify,
        dasherize: strings.dasherize,
        camelize: strings.camelize,
        name: options.name
      }),
      move('/src/app/shared/types/tasks/')
    ]);

    return mergeWith(templateSource);
  };
}
