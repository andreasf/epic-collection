import * as React from "react";
import {ReactNode} from "react";
import "./main.css";
import "./LandingPage.css";

export class LandingPage extends React.Component {
    public render(): ReactNode {
        return (
            <div className="landing-page">
                <h1>Epic Collection</h1>
                <div className="subtitle">
                    <div>clean up your Spotify library</div>
                    <div className="disclaimer">(not affiliated with Spotify)</div>
                </div>
                <div className="introduction">
                    <p>
                        Epic Collection helps you reclaim space in your Spotify library when you have reached the limit
                        of 10000 tracks.
                    </p>
                    <p>It frees up space by moving albums, not deleting them. That means you can keep all your music.</p>
                </div>
                <div className="login">
                    <a href="/home">Open Epic Collection</a>
                </div>
                <h2>How does it work?</h2>
                <div>
                    <p>
                        Spotify accounts consist of a library of saved tracks and albums, <i>and</i> a set of playlists. That's right,
                        playlists are not part of the library. In fact, <i>each</i> playlist has the same maximum size as the entire
                        library.
                    </p>
                    <p>
                        Epic Collection makes use of this by moving whole albums from the library to a new playlist. By moving an
                        album with 10 tracks, it frees up 11 spots in the library: one for each track and an extra item for the album
                        itself.
                    </p>
                </div>
                <h2>FAQ</h2>
                <ul className="faq">
                    <li>
                        <div className="question">Can I still download moved albums?</div>
                        <div className="answer">Yes, just download the entire playlist.</div>
                    </li>
                    <li>
                        <div className="question">Will moving albums out of my library affect recommendations?</div>
                        <div className="answer">Recommendations are usually based on listening behavior, not hoarding
                            behavior, so my guess
                            is no.
                        </div>
                    </li>
                    <li>
                        <div className="question">Is it safe to login with my Spotify credentials? Are you stealing my
                            password?
                        </div>
                        <div className="answer">
                            Yes, it's safe and no, I am not stealing your password. The app never even receives
                            your password. It uses the Spotify Web API and redirects you to Spotify itself for logging
                            in.
                        </div>
                    </li>
                    <li>
                        <div className="question">Are you stealing my data?</div>
                        <div className="answer">No, see below.</div>
                    </li>
                    <li>
                        <div className="question">I can't find the playlist!</div>
                        <div className="answer">
                            It should be called "Epic Collection [date and time]". If it's not displayed, try reloading
                            or
                            restarting Spotify.
                        </div>
                    </li>
                    <li>
                        <div className="question">Is there a way to give feedback?</div>
                        <div className="answer">Please create <a href="https://github.com/andreasf/epic-collection/issues/new/choose">a new "Feedback" issue here</a>.
                        </div>
                    </li>
                    <li>
                        <div className="question">This is helpful and I would like to contribute back in some way.</div>
                        <div className="answer">
                            Please consider <a href="https://www.betterplace.org/en/projects/2287-hilfe-fur-wohnungslose-kaltehilfe-der-berliner-stadtmission">donating to Berliner Kältehilfe</a>.
                        </div>
                    </li>
                </ul>
                <h2>Privacy</h2>
                <p>
                    Epic Collection is a pure frontend web application that exclusively talks to the Spotify Web API for the purpose of
                    freeing up space in the library. The web server serving this frontend collects technical HTTP access logs for
                    operational purposes, which could be stored for a limited amount of time. The app itself does not collect any data.
                </p>
                <p>
                    That being said, Spotify collects behavioral data (so that they can give recommendations) and makes some aggregate
                    statistics available to app developers through the Spotify Developer Dashboard, e.g.:
                </p>
                <ul>
                    <li>Daily and monthly active users</li>
                    <li>Number of requests per endpoint</li>
                    <li>Number of users per country</li>
                    <li>Total number of requests per day</li>
                </ul>
            </div>
        );
    }
}