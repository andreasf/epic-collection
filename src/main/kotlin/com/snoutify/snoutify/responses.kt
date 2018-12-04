package com.snoutify.snoutify

import com.fasterxml.jackson.annotation.JsonProperty

data class ProfileResponse(
        @JsonProperty("display_name")
        val displayName: String,
        val id: String
)

data class TracksResponse(
        val total: Long
)