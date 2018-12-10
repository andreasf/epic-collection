package com.snoutify.snoutify

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class SnoutifyApplication

fun main(args: Array<String>) {
    runApplication<SnoutifyApplication>(*args)
}
