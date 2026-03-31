import { expect, test, describe, mock } from "bun:test";
import { RoomUseCase } from "../application/RoomUseCase";
import type { IRoomRepository } from "../domain/IRoomRepository";
import type { RoomSettings } from "@impostor/shared";
import type { RoomEntity } from "../domain/entities";

describe("RoomUseCase", () => {
  test("createRoom generates a room with a 4-letter upper-case code", async () => {
    const mockRepo: any = {
      create: mock(async (req: any) => ({
        id: "uuid1",
        status: "WAITING",
        createdAt: new Date(),
        ...req
      })),
      findByCode: mock(async () => null),
      getPublicLobbies: mock(async () => []),
      update: mock(async () => {}),
    };
    const mockPlayerRepo: any = {
      findById: mock(async () => ({ id: "host-123", nickname: "Host" })),
    };

    const useCase = new RoomUseCase(mockRepo, mockPlayerRepo);
    
    const settings: RoomSettings = {
      name: "Test Room",
      maxPlayers: 8,
      mode: "TRADICIONAL",
      mainCategory: "General",
      subcategories: [],
      isPublic: true,
      timers: { clues: 30, discuss: 30, vote: 30 }
    };

    const room = await useCase.createRoom("host-123", settings);
    
    expect(room.code.length).toBe(4);
    expect(room.code).toMatch(/^[A-Z0-9]{4}$/);
    expect(room.hostId).toBe("host-123");
    expect(room.settings.name).toBe("Test Room");
    expect(mockRepo.create).toHaveBeenCalled();
  });

  test("createRoom caps maxPlayers to 10 if exceeded", async () => {
    const mockRepo: any = {
      create: mock(async (req: any) => ({ ...req, id: '1' })),
      findByCode: mock(async () => null),
    };
    const mockPlayerRepo: any = {
      findById: mock(async () => ({ id: "host-123" })),
    };

    const useCase = new RoomUseCase(mockRepo, mockPlayerRepo);
    const settings: any = {
      name: "Capped Room",
      maxPlayers: 15,
      mode: "TRADICIONAL",
      mainCategory: "General",
      subcategories: [],
      timers: { clues: 30, discuss: 30, vote: 30 }
    };

    const room = await useCase.createRoom("host-123", settings);
    expect(room.settings.maxPlayers).toBe(10);
  });

  test("createRoom caps timers if exceeded", async () => {
    const mockRepo: any = {
      create: mock(async (req: any) => ({ ...req, id: '1' })),
      findByCode: mock(async () => null),
    };
    const mockPlayerRepo: any = {
      findById: mock(async () => ({ id: "host-123" })),
    };

    const useCase = new RoomUseCase(mockRepo, mockPlayerRepo);
    const settings: any = {
      name: "Timer Capped Room",
      maxPlayers: 8,
      mode: "TRADICIONAL",
      mainCategory: "General",
      subcategories: [],
      timers: { clues: 200, discuss: 500, vote: 100 }
    };

    const room = await useCase.createRoom("host-123", settings);
    expect(room.settings.timers.clues).toBe(90);
    expect(room.settings.timers.discuss).toBe(180);
    expect(room.settings.timers.vote).toBe(60);
  });

  test("createRoom caps timers if below minimum", async () => {
    const mockRepo: any = {
      create: mock(async (req: any) => ({ ...req, id: '1' })),
      findByCode: mock(async () => null),
    };
    const mockPlayerRepo: any = {
      findById: mock(async () => ({ id: "host-123" })),
    };

    const useCase = new RoomUseCase(mockRepo, mockPlayerRepo);
    const settings: any = {
      name: "Timer Min Room",
      maxPlayers: 8,
      mode: "TRADICIONAL",
      mainCategory: "General",
      subcategories: [],
      timers: { clues: 10, discuss: 10, vote: 5 }
    };

    const room = await useCase.createRoom("host-123", settings);
    expect(room.settings.timers.clues).toBe(30);
    expect(room.settings.timers.discuss).toBe(60);
    expect(room.settings.timers.vote).toBe(15);
  });
});
