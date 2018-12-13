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
        and_i_see_the_track_count(5)
        and_i_see_the_album_count(3)
        and_i_see_the_remaining_count(9992)

        and_when_i_click_find()
        then_i_can_see_the_album_page()
        and_i_see_the_album("album-1-name", "artist-1 & artist-2")
        and_i_see_the_cover("http://localhost:$port/images/album-1.png")
        and_i_see_tracks_selected(0)

        and_when_i_click_select_for_removal()
        then_i_can_see_the_album_page()
        and_i_see_the_album("album-2-name", "artist-2, artist-3 & artist-4")
        and_i_see_the_cover("http://localhost:$port/images/album-2.png")
        and_i_see_tracks_selected(4)

        and_when_i_click_keep()
        then_i_can_see_the_album_page()
        and_i_see_the_album("album-3-name", "artist-1")
        and_i_see_the_cover("http://localhost:$port/images/album-3.png")
        and_i_see_tracks_selected(4)

        and_when_i_click_move()
        then_i_see_the_confirmation_page()
        and_when_i_click_cancel()
        then_i_can_see_the_album_page()

        and_when_i_click_move()
        then_i_see_the_confirmation_page()
        and_when_i_click_move()
        then_i_see_the_main_page()
        and_i_see_the_track_count(2)
        and_i_see_the_album_count(2)

        and_when_i_click_find()
        then_i_can_see_the_album_page()
        and_i_see_tracks_selected(0)
    }

    @Test
    fun user_can_cancel() {
        when_i_open_the_app()
        then_i_see_my_username()
        and_i_see_the_track_count(5)
        and_i_see_the_album_count(3)
        and_i_see_the_remaining_count(9992)

        and_when_i_click_find()
        then_i_can_see_the_album_page()
        and_i_see_tracks_selected(0)

        and_when_i_click_select_for_removal()
        then_i_can_see_the_album_page()
        and_i_see_tracks_selected(4)

        and_when_i_click_back()
        then_i_see_the_main_page()

        and_when_i_click_find()
        then_i_can_see_the_album_page()
        and_i_see_the_album("album-1-name", "artist-1 & artist-2")
        and_i_see_the_cover("http://localhost:$port/images/album-1.png")
        and_i_see_tracks_selected(0)
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

    private fun and_i_see_the_track_count(trackCount: Int) {
        assertThat(el(".track-count").textContent()).isEqualTo(trackCount.toString())
    }

    private fun and_i_see_the_album_count(albumCount: Int) {
        assertThat(el(".album-count").textContent()).isEqualTo(albumCount.toString())
    }

    private fun and_i_see_the_remaining_count(remaining: Int) {
        assertThat(el(".remaining-items").textContent()).isEqualTo(remaining.toString())
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
        assertThat(el(".album-cover").attribute("src"))
                .isEqualTo(url)
    }

    private fun and_i_see_tracks_selected(tracksSelected: Int) {
        assertThat(el(".selected-count .count").text()).isEqualTo(tracksSelected.toString())
    }

    private fun and_when_i_click_select_for_removal() {
        el("button.select").click()
    }

    private fun and_when_i_click_keep() {
        el("button.keep").click()
    }

    private fun and_when_i_click_back() {
        el(".back-button").click()
    }

    private fun then_i_see_the_main_page() {
        await().until(el(".main-page")).displayed()
    }

    private fun and_when_i_click_move() {
        el(".move-button").click()
    }

    private fun then_i_see_the_confirmation_page() {
        await().until(el(".confirmation-page")).displayed()
    }

    private fun and_when_i_click_cancel() {
        el(".cancel-button").click()
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
