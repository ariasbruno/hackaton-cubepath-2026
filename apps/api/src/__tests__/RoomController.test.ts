import { expect, test, describe, mock } from "bun:test";
import { Hono } from "hono";
import { createRoomController } from "../infrastructure/controllers/RoomController";
import { RoomUseCase } from "../application/RoomUseCase";
import type { IRoomRepository } from "../domain/IRoomRepository";

describe("RoomController Integration", () => {
  const mockRepo: any = {
    create: mock(async () => {}),
    findByCode: mock(async () => null),
    getPublicLobbies: mock(async () => [
      { 
        id: "room-uuid", 
        code: "TEST", 
        hostId: "host", 
        settings: { 
          name: "Test Room", 
          maxPlayers: 8, 
          mode: "TRADICIONAL", 
          mainCategory: "General", 
          subcategories: [], 
          isPublic: true, 
          timers: { clues: 30, discuss: 30, vote: 30 } 
        }, 
        status: "WAITING", 
        createdAt: new Date() 
      }
    ]),
    update: mock(async () => {}),
  };

  const useCase = new RoomUseCase(mockRepo);
  const router = createRoomController(useCase);
  const app = new Hono();
  app.route('/rooms', router);

  test("GET /rooms returns public rooms array", async () => {
    const res = await app.request('/rooms');
    expect(res.status).toBe(200);
    
    const body = await res.json();
    expect(Array.isArray(body.rooms)).toBe(true);
    expect(body.rooms.length).toBe(1);
    expect(body.rooms[0].code).toBe("TEST");
  });
});
