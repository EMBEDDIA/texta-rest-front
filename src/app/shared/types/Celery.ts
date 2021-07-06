
export interface ShortTermTasks {
  active: number;
  reserved: number;
  scheduled: number;
}

export interface LongTermTasks {
  active: number;
  reserved: number;
  scheduled: number;
}

export interface MlpQueue {
  active: number;
  reserved: number;
  scheduled: number;
}

export interface CeleryCountTasks {
  short_term_tasks: ShortTermTasks;
  long_term_tasks: LongTermTasks;
  mlp_queue: MlpQueue;
}
