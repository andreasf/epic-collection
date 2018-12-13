package com.snoutify.snoutify

import au.com.dius.pact.provider.junit.PactRunner
import au.com.dius.pact.provider.junit.Provider
import au.com.dius.pact.provider.junit.State
import au.com.dius.pact.provider.junit.loader.PactFolder
import au.com.dius.pact.provider.junit.target.HttpTarget
import au.com.dius.pact.provider.junit.target.TestTarget
import org.junit.After
import org.junit.AfterClass
import org.junit.BeforeClass
import org.junit.runner.RunWith
import org.springframework.boot.SpringApplication
import org.springframework.context.ConfigurableApplicationContext

@RunWith(PactRunner::class)
@Provider("spotify")
@PactFolder("frontend/pacts")
open class PactIntegrationTest {
    @TestTarget
    @JvmField
    val target = HttpTarget(port = port, path = "/fake")

    @State("with test user")
    fun toTestUserState() {
    }

    @State("with 5 tracks")
    fun to5TracksState() {
        fakeLibraryService.setAlbums(listOf(album1, album2, album3))
    }

    @State("with 3 albums")
    fun to3AlbumsState() {
        fakeLibraryService.setAlbums(listOf(album1, album2, album3))
    }

    @State("with paginated album")
    fun toPaginatedAlbumsState() {
        fakeLibraryService.setAlbums(listOf(paginatedAlbum))
    }

    @State("endpoints returning 500")
    fun toErrorState() {
        fakeProfileController.setCrash(true)
        fakeLibraryService.setCrash(true)
    }

    @After
    fun afterEach() {
        fakeProfileController.setCrash(false)
        fakeLibraryService.setCrash(false)
    }

    companion object {
        val port = 8081

        lateinit var context: ConfigurableApplicationContext
        lateinit var fakeLibraryService: FakeLibraryService
        lateinit var fakeProfileController: FakeProfileController

        @BeforeClass
        @JvmStatic
        fun beforeAll() {
            val app = SpringApplication(SnoutifyApplication::class.java)
            context = app.run("--server.port=$port")
            fakeLibraryService = context.getBean(FakeLibraryService::class.java)
            fakeProfileController = context.getBean(FakeProfileController::class.java)
        }

        @AfterClass
        @JvmStatic
        fun afterAll() {
            context.stop()
        }
    }
}