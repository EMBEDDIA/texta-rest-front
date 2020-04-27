export class Project {
  url = '';
  id: number;
  title = '';
  owner: number;
  users: string[];
  indices: string[];
  author_username: string;
  resources: {
    embeddings: number[];
    embedding_clusters: number[];
    taggers: number[];
  };
}

export class ProjectResourceCounts {
  num_lexicons = 0;
  num_taggers = 0;
  num_tagger_groups = 0;
  num_neurotaggers = 0;
  num_embeddings = 0;
  num_embedding_clusters = 0;
  num_torchtaggers = 0;
  num_clusterings = 0;
}

export interface ProjectFact {
  name: string;
  values: string[];
}

export interface Field {
  path: string;
  type: string;
}

export class ProjectIndex {
  index: string;
  fields: Field[];

  static sortTextaFactsAsFirstItem(fields: ProjectIndex[]): ProjectIndex[] {
    fields = JSON.parse(JSON.stringify(fields)); // deep clone, dont want to change original
    return fields.map((field: ProjectIndex) => {
      field.fields.sort((x, y) => (x.type === 'fact' ? -1 : y.type === 'fact' ? 1 : 0));
      return field;
    });
  }

  static isProjectFields(object): object is ProjectIndex | ProjectIndex[] {
    if (Array.isArray(object) && object.length > 0) {
      return (
        (object[0] as ProjectIndex).index !== undefined &&
        (object[0] as ProjectIndex).fields !== undefined
      );
    } else {
      return (
        (object as ProjectIndex).index !== undefined &&
        (object as ProjectIndex).fields !== undefined
      );
    }
  }

  static cleanProjectIndicesFields(fields: ProjectIndex[], whiteList: string[], blackList: string[]): ProjectIndex[] {
    fields = JSON.parse(JSON.stringify(fields)); // deep clone, dont want to change original
    const filteredField: ProjectIndex[] = [];
    const whiteListTypes = whiteList && whiteList.length > 0 ? whiteList : null;
    const blackListTypes = blackList && blackList.length > 0 ? blackList : null;
    for (const index of fields) {
      index.fields = index.fields.filter(element => {
        if (whiteListTypes && whiteListTypes.includes(element.type)) {
          return true;
        }
        if (blackListTypes && blackListTypes.includes(element.type)) {
          return false;
        }
      });
      if (index.fields.length > 0) {
        filteredField.push(index);
      }
    }
    return filteredField;
  }
}

// for the project/{id}/heath endpoint
export interface Health {
  host: {
    cpu: { percent: number };
    gpu: { count: number; devices: string[] };
    memory: { free: number, total: number, used: number, unit: string };
    disk: { free: number, total: number, used: number, unit: string };
  };
  toolkit: {
    active_tasks: number;
    version: string;
  };
  services: {
    elastic: {
      url: string;
      alive: boolean;
      status: {
        name: string;
        cluster_name: string;
        cluster_uuid: string;
        version: {
          number: string;
          build_flavor: string;
          build_type: string;
          build_hash: string;
          build_date: string;
          build_snapshot: boolean;
          lucene_version: string;
          minimum_wire_compatibility_version: string;
          minimum_index_compatibility_version: string;
        };
        tagline: string;
      };
    };
    mlp: { url: string, alive: boolean, status: { loaded_entities: string[], version: string, service: string } };
    redis: { alive: boolean, version: number, expired_keys: number, used_memory: string, total_memory: string };
  };
}

// this interface is for localstorage
export interface ProjectState {
  searcher: {
    itemsPerPage: number;
    selectedFields: string[];
    searcherType: 1 | 2;
  };
  models: {
    tagger: { itemsPerPage: number; }
    embedding: { itemsPerPage: number; }
    torchTagger: { itemsPerPage: number; }
    taggerGroup: { itemsPerPage: number; }
  };
  tasks: {};
  lexicons: { embeddingId: number | null; };
  global: { selectedIndices: string[] };
}
