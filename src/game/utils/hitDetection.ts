import { Pattern } from '../types';

export class HitDetection {
  static readonly EXPERT_TOLERANCE = 75; // Increased tolerance for better UX

  static getClosestCircleIndex(
    clickX: number, 
    clickY: number,
    circlePositions: Array<{ x: number, y: number }>,
    tolerance: number
  ): number {
    let closestIndex = -1;
    let closestDistance = Number.MAX_VALUE;

    circlePositions.forEach((circle, index) => {
      const distance = Math.sqrt(
        Math.pow(clickX - circle.x, 2) + 
        Math.pow(clickY - circle.y, 2)
      );

      if (distance < closestDistance && distance <= tolerance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  }
}
