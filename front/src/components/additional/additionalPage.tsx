import React from "react";
import "../../styles/App.css";


export default function AdditionalInfo() {
  const spotifyPlaylistEmbed = "https://open.spotify.com/embed/playlist/0pDzeMsIZxauC4WjhBd16D?utm_source=generator"; // Replace with your Spotify playlist URL
  
  return (
    <div className="progress-page">
      <header className="progress-header">
      </header>
      <div className="progress-content">
      <section className="introduction">
          <h1>Welcome to Your Fitness Journey!</h1>
          <p>
            Whether you're stepping into the world of fitness for the first time or continuing your ongoing quest for a healthier lifestyle, welcome to our space—a place designed to celebrate every step of your unique journey.
          </p>

        </section>
        
       
        <section className="resources">
          <h2>FAQs</h2>
          <ul>
            <li>
              <a href="https://www.thebodycoach.com/blog/the-importance-of-rest-days/#:~:text=Every%20time%20you%20work%20out,less%20effort%20in%20the%20future.&text=If%20you%20skip%20rest%20days,longer%20spells%20out%20through%20injury.">Why should I have rest days?</a>
            </li>
            <li>
              <a href="https://barbend.com/workout-splits/">What are the different workout splits?</a>
            </li>
            <li>
              <a href="https://blog.nasm.org/sports-performance/back-to-the-basics-hypertrophy#:~:text=Exercises%20featuring%20an%20increased%20range,MVIC)%20and%20loading%2Funloading.">What is hypertrophy?</a>
            </li>
            </ul>
            
        </section>
        <section className="playlist">
          <h2>Gym Playlist</h2>
            <h3>Jam out while you work out!</h3>
          <iframe
            style={{ borderRadius: "12px" }} // Pass an object with CSS properties
            src={spotifyPlaylistEmbed}
            width="100%"
            height="352"
            frameBorder="0"
            allowFullScreen={true}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"></iframe>
        </section>
      </div>
    </div>
  );
}


