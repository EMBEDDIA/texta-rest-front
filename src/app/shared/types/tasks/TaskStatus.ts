
export interface TextaTask{
  id: number;
  status: string;
  progress: number;
  step: string;
  task_type: string;
  errors: string;
  time_started: Date;
  last_update: Date;
  time_completed: Date;
  total: number;
  num_processed: number;
}
export class TaskStatus {
  id: 0;
  status: string;
  progress = 0.0;
  step = '';
  errors = '';
  time_started = '';
  last_update = null;
  time_completed = null;
  num_processed = 0;
  total = 0;
}
