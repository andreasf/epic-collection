package com.snoutify.snoutify

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping


@Controller
class FrontendController {
    @RequestMapping(
            "/",
            "/home",
            "/find-albums",
            "/oauth/callback")
    fun frontend(): String {
        return "/index.html"
    }
}