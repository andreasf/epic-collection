package com.snoutify.snoutify.acceptance

import io.github.bonigarcia.wdm.WebDriverManager
import org.assertj.core.api.Assertions.assertThat
import org.fluentlenium.adapter.junit.FluentTest
import org.junit.BeforeClass
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.junit4.SpringRunner

@RunWith(SpringRunner::class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT,
        properties = ["server.port=3000"])
class UserFlowTest : FluentTest() {
    val port = 3000

    @Test
    fun user_can_login() {
        when_i_open_the_app()
        then_i_see_my_username()
        and_i_see_the_track_count()
        and_i_see_the_album_count()
        and_i_see_the_remaining_count()
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
        assertThat(el(".album-count").textContent()).isEqualTo("2")
    }

    private fun and_i_see_the_remaining_count() {
        assertThat(el(".remaining-items").textContent()).isEqualTo("9995")
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