import { useState } from 'react'
import '../styles/Carousel.css'
import background from '../img/background.png'

function Carousel() {
  return (
    <>
        <div class="background-container">
          <img class="background" src={background} alt="Background" />
        </div>

    </>
  )
}


export default Carousel