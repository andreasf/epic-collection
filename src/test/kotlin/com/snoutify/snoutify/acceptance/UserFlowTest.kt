package com.snoutify.snoutify.acceptance

import com.snoutify.snoutify.FakeProfileController
import io.github.bonigarcia.wdm.WebDriverManager
import org.assertj.core.api.Assertions.assertThat
import org.fluentlenium.adapter.junit.FluentTest
import org.junit.After
import org.junit.BeforeClass
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.junit4.SpringRunner

@RunWith(SpringRunner::class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT,
        properties = ["server.port=3000"])
class UserFlowTest : FluentTest() {
    val port = 3000

    @Autowired
    lateinit var fakeProfileController: FakeProfileController

    @After
    fun afterEach() {
        fakeProfileController.setCrash(false)
    }

    @Test
    fun user_can_login_and_find_albums_to_remove() {
        when_i_open_the_app()
        then_i_see_my_username()
        and_i_see_the_track_count()
        and_i_see_the_album_count()
        and_i_see_the_remaining_count()

        and_when_i_click_find()
        then_i_can_see_the_album_page()
        and_i_see_the_album("album-1-name", "artist-1 & artist-2")
        and_i_see_the_cover("http://localhost:$port/images/album-1.png")
    }

    @Test
    fun app_shows_error_messages() {
        fakeProfileController.setCrash(true)

        when_i_open_the_app()
        then_i_see_an_error_message()
    }

    private fun when_i_open_the_app() {
        goTo("http://localhost:$port")
        await().until(el(".main-page")).displayed()
    }

    private fun then_i_see_my_username() {
        assertThat(el(".main-page").textContent()).contains("Test User")
    }

    private fun and_i_see_the_track_count() {
        assertThat(el(".track-count").textContent()).isEqualTo("3")
    }

    private fun and_i_see_the_album_count() {
        assertThat(el(".album-count").textContent()).isEqualTo("3")
    }

    private fun and_i_see_the_remaining_count() {
        assertThat(el(".remaining-items").textContent()).isEqualTo("9994")
    }

    private fun then_i_see_an_error_message() {
        assertThat(el(".error-message .message .text").textContent().trim())
                .isEqualTo("error retrieving username: 500")
    }

    private fun and_when_i_click_find() {
        el(".find-albums").click()
    }

    private fun then_i_can_see_the_album_page() {
        await().until(el(".album-page")).displayed()
    }

    private fun and_i_see_the_album(albumName: String, artist: String) {
        assertThat(el(".album-name").text()).isEqualTo(albumName)
        assertThat(el(".album-artists").text()).isEqualTo(artist)
    }

    private fun and_i_see_the_cover(url: String) {
        assertThat(el(".album-cover img").attribute("src"))
                .isEqualTo(url)
    }

    companion object {
        @BeforeClass
        @JvmStatic
        fun setup() {
            System.setProperty("wdm.avoidAutoVersion", "true")
            WebDriverManager.firefoxdriver().setup()
        }
    }
}
