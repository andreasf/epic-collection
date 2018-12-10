package com.snoutify.snoutify

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping


@Controller
class FrontendController {
    @RequestMapping(
            "/",
            "/oauth/callback")
    fun frontend(): String {
        return "/index.html"
    }
}