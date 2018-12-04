package com.snoutify.snoutify.acceptance

import io.github.bonigarcia.wdm.Shell.runAndWait
import io.github.bonigarcia.wdm.WebDriverManager
import org.apache.commons.lang3.SystemUtils.IS_OS_LINUX
import org.apache.commons.lang3.SystemUtils.IS_OS_MAC
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
            println("IS_OS_LINUX: $IS_OS_LINUX")
            println("IS_OS_MAC: $IS_OS_MAC")

            val version = runAndWait("firefox", "-v")
            println("version output according to wdm helper: $version")

            WebDriverManager.firefoxdriver().setup()
        }
    }
}