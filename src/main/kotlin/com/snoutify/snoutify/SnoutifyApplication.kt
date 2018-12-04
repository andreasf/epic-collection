package com.snoutify.snoutify

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping

@SpringBootApplication
class SnoutifyApplication

fun main(args: Array<String>) {
    runApplication<SnoutifyApplication>(*args)
}

@Controller
class FrontendController {
    @RequestMapping(
            "/",
            "/oauth/callback")
    fun frontend(): String {
        return "/index.html"
    }
}