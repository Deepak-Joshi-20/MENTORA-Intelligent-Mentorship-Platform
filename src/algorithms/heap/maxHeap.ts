import { CandidateEvaluation } from '../../types';

export interface HeapTraceStep {
  operation: 'insert' | 'extract-max' | 'heapify-up' | 'heapify-down';
  description: string;
  heapSnapshot: { id: string; name: string; score: number }[];
}

/**
 * Max Heap implementation based on CandidateEvaluation match scores.
 * Efficiently maintains the highest-scoring candidate at the root.
 *
 * Time Complexities:
 * - Build Heap: O(k)
 * - Insert: O(log k)
 * - Extract Max: O(log k)
 * - Peek Max: O(1)
 */
export class MaxHeapCandidates {
  private heap: CandidateEvaluation[] = [];
  public trace: HeapTraceStep[] = [];

  constructor(initialItems: CandidateEvaluation[] = [], enableTrace = false) {
    if (enableTrace) {
      this.trace = [];
    }
    for (const item of initialItems) {
      this.insert(item, enableTrace);
    }
  }

  public size(): number {
    return this.heap.length;
  }

  public isEmpty(): boolean {
    return this.heap.length === 0;
  }

  public peek(): CandidateEvaluation | null {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  public getArraySnapshot(): { id: string; name: string; score: number }[] {
    return this.heap.map(h => ({
      id: h.mentor.mentor_id,
      name: h.mentor.name,
      score: h.score_breakdown.total_score,
    }));
  }

  public insert(item: CandidateEvaluation, recordTrace = false): void {
    this.heap.push(item);
    if (recordTrace) {
      this.trace.push({
        operation: 'insert',
        description: `Pushed mentor ${item.mentor.name} (${item.mentor.mentor_id}) with score ${item.score_breakdown.total_score} to leaf index ${this.heap.length - 1}.`,
        heapSnapshot: this.getArraySnapshot(),
      });
    }
    this.heapifyUp(this.heap.length - 1, recordTrace);
  }

  public extractMax(recordTrace = false): CandidateEvaluation | null {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) {
      const single = this.heap.pop()!;
      if (recordTrace) {
        this.trace.push({
          operation: 'extract-max',
          description: `Extracted sole maximum element: ${single.mentor.name} (${single.score_breakdown.total_score}).`,
          heapSnapshot: [],
        });
      }
      return single;
    }

    const maxItem = this.heap[0];
    const lastItem = this.heap.pop()!;
    this.heap[0] = lastItem;

    if (recordTrace) {
      this.trace.push({
        operation: 'extract-max',
        description: `Extracted root maximum ${maxItem.mentor.name} (${maxItem.score_breakdown.total_score}). Replaced root with leaf ${lastItem.mentor.name}.`,
        heapSnapshot: this.getArraySnapshot(),
      });
    }

    this.heapifyDown(0, recordTrace);
    return maxItem;
  }

  private heapifyUp(index: number, recordTrace: boolean): void {
    let current = index;
    while (current > 0) {
      const parent = Math.floor((current - 1) / 2);
      if (this.isGreater(this.heap[current], this.heap[parent])) {
        // Swap
        const temp = this.heap[current];
        this.heap[current] = this.heap[parent];
        this.heap[parent] = temp;

        if (recordTrace) {
          this.trace.push({
            operation: 'heapify-up',
            description: `Swapped index ${current} (${this.heap[parent].mentor.name}) with parent index ${parent}.`,
            heapSnapshot: this.getArraySnapshot(),
          });
        }
        current = parent;
      } else {
        break;
      }
    }
  }

  private heapifyDown(index: number, recordTrace: boolean): void {
    let current = index;
    const length = this.heap.length;

    while (true) {
      const leftChild = 2 * current + 1;
      const rightChild = 2 * current + 2;
      let largest = current;

      if (leftChild < length && this.isGreater(this.heap[leftChild], this.heap[largest])) {
        largest = leftChild;
      }

      if (rightChild < length && this.isGreater(this.heap[rightChild], this.heap[largest])) {
        largest = rightChild;
      }

      if (largest !== current) {
        const temp = this.heap[current];
        this.heap[current] = this.heap[largest];
        this.heap[largest] = temp;

        if (recordTrace) {
          this.trace.push({
            operation: 'heapify-down',
            description: `Swapped index ${current} with larger child index ${largest} (${this.heap[largest].mentor.name}).`,
            heapSnapshot: this.getArraySnapshot(),
          });
        }
        current = largest;
      } else {
        break;
      }
    }
  }

  private isGreater(a: CandidateEvaluation, b: CandidateEvaluation): boolean {
    const scoreA = a.score_breakdown.total_score;
    const scoreB = b.score_breakdown.total_score;
    if (scoreA !== scoreB) {
      return scoreA > scoreB;
    }
    // Tie-breaker: higher remaining capacity
    const remA = a.mentor.max_capacity - a.mentor.current_load;
    const remB = b.mentor.max_capacity - b.mentor.current_load;
    if (remA !== remB) {
      return remA > remB;
    }
    return a.mentor.mentor_id.localeCompare(b.mentor.mentor_id) < 0;
  }
}
