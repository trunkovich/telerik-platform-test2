export interface DebugState {
}

const initialDebugState = {};

export function debugReducer(state: DebugState = initialDebugState, action): DebugState {
  // console.dir(action);
  console.log(`NEW ACTION: ${action.type}`);
  return state;
}
