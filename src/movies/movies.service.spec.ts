import { Test, TestingModule } from "@nestjs/testing"
import { MoviesService } from "./movies.service"
import { Movie } from "./entities/movie.entity"
import { NotFoundException } from "@nestjs/common"

describe("MoviesService", () => {
  let service: MoviesService

  //beforeEach를 제외한 많은 hook들이 있다
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile()

    service = module.get<MoviesService>(MoviesService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("getAll", () => {
    it("should return an array", () => {
      const result = service.getAll()
      expect(result).toBeInstanceOf(Array)
    })
  })

  describe("getOne", () => {
    it("should return a movie", () => {
      service.create({ title: "Test Movie", genres: ["test"], year: 2020 })
      const movie = service.getOne(1)
      expect(movie).toBeDefined()
      expect(movie.id).toEqual(1)
    })

    it("should throw 404 error", () => {
      try {
        service.getOne(999)
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException)
        expect(e.message).toEqual("Movie with ID 999 not found.")
      }
    })
  })

  describe("deleteOne", () => {
    it("deletes a movie", () => {
      service.create({ title: "Test Movie", genres: ["test"], year: 2020 })
      const allMovies = service.getAll()
      service.deleteOne(1)
      const afterDelete = service.getAll()
      expect(afterDelete.length).toBeLessThan(allMovies.length)
      expect(afterDelete.length).toEqual(allMovies.length - 1)
    })

    it("should throw a NotFoundException", () => {
      try {
        service.deleteOne(1)
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException)
        expect(e.message).toEqual("Movie with ID 1 not found.")
      }
    })
  })

  describe("create", () => {
    it("should create a movie", () => {
      const beforeCreate = service.getAll().splice(0)
      console.log("beforeCreate", beforeCreate)
      service.create({ title: "Test Movie", genres: ["test"], year: 2020 })
      const afterCreate = service.getAll()
      console.log("beforeCreate2", beforeCreate)
      console.log("afterCreate", afterCreate)
      expect(afterCreate.length).toBeGreaterThan(beforeCreate.length)
      expect(afterCreate.length).toEqual(beforeCreate.length + 1)
    })
  })

  describe("update", () => {
    it("should update a movie", () => {
      service.create({ title: "Test Movie", genres: ["test"], year: 2020 })
      service.update(1, { title: "Updated Test" })
      const movie = service.getOne(1)
      expect(movie.title).toEqual("Updated Test")
    })

    it("should throw 404 error", () => {
      try {
        service.getOne(999)
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException)
        expect(e.message).toEqual("Movie with ID 999 not found.")
      }
    })
  })
})
