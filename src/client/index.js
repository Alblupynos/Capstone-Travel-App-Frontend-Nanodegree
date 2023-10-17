import {handleSubmit} from './js/app'
import './styles/style.scss'

const generate = document.getElementById("generate");
generate.addEventListener('click', handleSubmit)


export { handleSubmit }