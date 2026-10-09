import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Memory } from '../memories/entities/memory.entity';

export interface LocationSummary {
  locationName: string;
  latitude: number;
  longitude: number;
  count: number;
  latestMemoryDate: string;
  memories: {
    id: string;
    title: string;
    memoryDate: string;
    mood: string;
  }[];
}

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Memory)
    private readonly memoryRepository: Repository<Memory>,
  ) {}

  async getUserLocations(userId: string): Promise<LocationSummary[]> {
    const memories = await this.memoryRepository.find({
      where: { userId },
      order: { memoryDate: 'DESC' },
    });

    const locationMap = new Map<string, LocationSummary>();

    for (const mem of memories) {
      if (!mem.locationName) continue;

      const key = mem.locationName.trim().toLowerCase();
      if (!locationMap.has(key)) {
        locationMap.set(key, {
          locationName: mem.locationName.trim(),
          latitude: mem.latitude ?? 23.8103, // default to valid coordinate if unspecified
          longitude: mem.longitude ?? 90.4125,
          count: 0,
          latestMemoryDate: mem.memoryDate,
          memories: [],
        });
      }

      const item = locationMap.get(key)!;
      item.count += 1;
      // If the memory has coordinates, prefer its coordinates
      if (mem.latitude && mem.longitude) {
        item.latitude = mem.latitude;
        item.longitude = mem.longitude;
      }
      item.memories.push({
        id: mem.id,
        title: mem.title,
        memoryDate: mem.memoryDate,
        mood: mem.mood,
      });
    }

    return Array.from(locationMap.values()).sort((a, b) => b.count - a.count);
  }
}
