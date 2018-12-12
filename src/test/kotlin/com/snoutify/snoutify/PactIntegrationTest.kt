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
        context.getBean(FakeLibraryService::class.java).setAlbums(listOf(album1, album2, album3))
    }

    @State("with 3 albums")
    fun to3AlbumsState() {
        context.getBean(FakeLibraryService::class.java).setAlbums(listOf(album1, album2, album3))
    }

    @State("endpoints returning 500")
    fun toErrorState() {
        context.getBean(FakeProfileController::class.java).setCrash(true)
        context.getBean(FakeLibraryService::class.java).setCrash(true)
    }

    @After
    fun afterEach() {
        context.getBean(FakeProfileController::class.java).setCrash(false)
        context.getBean(FakeLibraryService::class.java).setCrash(false)
    }

    companion object {
        val port = 8081

        lateinit var context: ConfigurableApplicationContext

        @BeforeClass
        @JvmStatic
        fun beforeAll() {
            val app = SpringApplication(SnoutifyApplication::class.java)
            context = app.run("--server.port=$port")
        }

        @AfterClass
        @JvmStatic
        fun afterAll() {
            context.stop()
        }
    }
}