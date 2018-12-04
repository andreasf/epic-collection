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
class LoginTest : FluentTest() {
    val port = 3000

    @Test
    fun user_can_login() {
        goTo("http://localhost:$port")
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