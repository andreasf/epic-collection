package com.snoutify.snoutify

import com.nhaarman.mockitokotlin2.whenever
import org.junit.Before
import org.junit.Test
import org.mockito.ArgumentMatchers
import org.mockito.Mockito.*
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.test.web.servlet.setup.MockMvcBuilders

class FakeLibraryControllerTest {
    lateinit var mockMvc: MockMvc
    lateinit var fakeLibraryService: FakeLibraryService

    @Before
    fun beforeEach() {
        fakeLibraryService = mock(FakeLibraryService::class.java)
        val controller = FakeLibraryController(fakeLibraryService)
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build()
    }

    @Test
    fun albums_success_returnsAlbums() {
        whenever(fakeLibraryService.getAlbum(ArgumentMatchers.anyInt()))
                .thenReturn(PaginatedLibraryAlbums(listOf(LibraryAlbum(album1)), 42))

        mockMvc.perform(get("/fake/v1/me/albums?limit=1&offset=23"))
                .andExpect(status().isOk)
                .andExpect(content().json(jsonResponse))
    }

    @Test
    fun albums_limitNot1_returns500() {
        whenever(fakeLibraryService.getAlbum(ArgumentMatchers.anyInt()))
                .thenReturn(PaginatedLibraryAlbums(listOf(LibraryAlbum(album1)), 42))

        mockMvc.perform(get("/fake/v1/me/albums?limit=5&offset=23"))
                .andExpect(status().isInternalServerError)
    }

    @Test
    fun albums_notFound_returnsEmptyList() {
        whenever(fakeLibraryService.getAlbum(ArgumentMatchers.anyInt()))
                .thenReturn(PaginatedLibraryAlbums(emptyList(), 42))

        mockMvc.perform(get("/fake/v1/me/albums?limit=1&offset=2342"))
                .andExpect(status().isOk)
                .andExpect(content().json(emptyItemsResponse))
    }

    @Test
    fun albums_crashRequested_returns500() {
        whenever(fakeLibraryService.getAlbum(ArgumentMatchers.anyInt()))
                .thenThrow(RuntimeException())

        mockMvc.perform(get("/fake/v1/me/albums?limit=1&offset=2342"))
                .andExpect(status().isInternalServerError)
    }

    @Test
    fun deleteAlbum_deletesAndReturns200() {
        mockMvc.perform(delete("/fake/v1/me/albums?ids=album-id-1,album-id-2"))
                .andExpect(status().isOk)

        verify(fakeLibraryService).deleteAlbum("album-id-1")
        verify(fakeLibraryService).deleteAlbum("album-id-2")
    }

    companion object {
        const val jsonResponse = "{\n" +
                "  \"items\": [\n" +
                "    {\n" +
                "      \"album\": {\n" +
                "        \"id\": \"album-1-id\",\n" +
                "        \"name\": \"album-1-name\",\n" +
                "        \"artists\": [\n" +
                "          {\n" +
                "            \"name\": \"artist-1\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"name\": \"artist-2\"\n" +
                "          }\n" +
                "        ],\n" +
                "        \"images\": [\n" +
                "          {\n" +
                "            \"width\": 480,\n" +
                "            \"height\": 480,\n" +
                "            \"url\": \"/images/album-1.png\"\n" +
                "          }\n" +
                "        ]\n" +
                "      }\n" +
                "    }\n" +
                "  ],\n" +
                "  \"total\": 42\n" +
                "}"

        const val emptyItemsResponse = "{\n" +
                "  \"items\": [],\n" +
                "  \"total\": 42\n" +
                "}"
    }
}
