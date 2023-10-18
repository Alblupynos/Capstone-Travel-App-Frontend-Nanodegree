import {handleSubmit, deleteData} from './js/app'
import './styles/style.scss'

const generate = document.getElementById("generate");
generate.addEventListener('click', handleSubmit)
const deleteTrip = document.getElementById("deleteTrip");
deleteTrip.addEventListener('click', deleteData)


export { handleSubmit }