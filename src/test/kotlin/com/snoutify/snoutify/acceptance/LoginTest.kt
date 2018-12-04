package com.snoutify.snoutify.acceptance

import io.github.bonigarcia.wdm.WebDriverManager
import org.assertj.core.api.Assertions.assertThat
import org.fluentlenium.adapter.junit.FluentTest
import org.junit.BeforeClass
import org.junit.Ignore
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.junit4.SpringRunner

@RunWith(SpringRunner::class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT,
        properties = ["server.port=3000"])
class LoginTest : FluentTest() {
    val port = 3000

    @Value("\${spotify.username}")
    private lateinit var username: String

    @Value("\${spotify.password}")
    private lateinit var password: String

    @Test
    @Ignore
    fun user_can_login() {
        goTo("http://localhost:$port")
        await().until(el("#login-username")).displayed()

        el("#login-username").fill().with(username)
        el("#login-password").fill().with(password)
        el("#login-button").click()

        await().until(el(".main-page")).displayed()
        assertThat(el(".main-page").textContent()).contains("Test User")
    }

    companion object {
        @BeforeClass
        @JvmStatic
        fun setup() {
            WebDriverManager.firefoxdriver().setup()
        }
    }
}