/**
 * One requestAnimationFrame loop for the whole library. It only runs while at
 * least one task asks for another frame, so idle pages cost nothing.
 *
 * Tasks run in two phases per frame: `read` (layout measurements) for every
 * task first, then `write` (style mutations). This avoids layout thrashing
 * when many surfaces animate at once.
 */
export interface FrameTask {
    /** Measure. Return false to skip `write` this frame. */
    read?(now: number): boolean | void;
    /** Mutate. Return true to request another frame. */
    write(now: number, dt: number): boolean | void;
}
/** Register a task; it is idle until `wake` is called. */
export declare function addTask(task: FrameTask): () => void;
/** Ask for `task` to run on the next frame. */
export declare function wake(task: FrameTask): void;
