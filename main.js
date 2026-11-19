let url = 'http://localhost:3000/api/activites'
const cardsContainer = document.getElementById("cardsContainer")
const formAjoute = document.forms.forAjoute
const formNom = document.forms.formNom
const divAjouterNom = document.getElementById('formAjouterNom')
let nomAuteur = localStorage.getItem('nom')
let editNom = document.getElementById('editNom')
let activites = []

async function getData(url) {
    const res = await axios.get(url)
    const data = await res.data
    activites = data
    console.log(data)
    afficherDat(data)
    rechrcherActivite(data)
    rechrchParThem(data)
}
getData(url)


console.log(formAjoute.checkId.value)
console.log(nomAuteur)
if (nomAuteur !== null) {
    divAjouterNom.classList.add('hidden')
    document.getElementById('nomAuteur').textContent = nomAuteur
} else {
    divAjouterNom.classList.remove('hidden')
    setNom()
}

function setNom() {
    formNom.addEventListener('submit', event => {
        event.preventDefault()

        const nom = formNom.nom.value

        if (!/^[a-zA-Z]+(\s+[a-zA-Z]+)+$/.test(nom)) {
            document.getElementById('errorNom').textContent = 'L’auteur doit être un nom complet contenant au moins deux parties.'
            return
        }
        localStorage.setItem('nom', nom)
        nomAuteur = localStorage.getItem('nom')
        divAjouterNom.classList.add('hidden')
        document.getElementById('nomAuteur').textContent = nom
    })
}


editNom.addEventListener('click', () => {
    console.log('clicked')
    divAjouterNom.classList.remove('hidden')
    setNom()
})


function activiteNotFound() {
    cardsContainer.textContent = ''
    let p = document.createElement('p')
    p.className = 'text-red-600 text-2xl'
    p.textContent = 'Aucun resultat 😢'
    cardsContainer.append(p)
}

function afficherDat(data) {
    cardsContainer.textContent = ''
    if (data.length > 0) {
        data.forEach(element => {
            cardsContainer.append(divCard(element))
        })
        return
    }
    activiteNotFound()
}

function rechrcherActivite(data) {
    document.getElementById("rechrcher").addEventListener('input', event => {
        let vlaueInput = event.target.value.toLowerCase()
        let activiteFound = data.filter(element => element.titre.toLowerCase().includes(vlaueInput))
        console.log(activiteFound)
        if (activiteFound.length > 0) {
            afficherDat(activiteFound)
            return
        }
        if (vlaueInput == '') {
            afficherDat(data)
            return
        }
        activiteNotFound()
    })
}


function rechrchParThem(data) {
    document.getElementById('rechrcehThem').addEventListener('input', async (event) => {
        let valueSelect = event.target.value.toLowerCase()
        let activiteFound = await axios.get(`${url}?theme=${valueSelect}`).catch(err => console.error('Il y a un erreur: ', err))
        console.log(activiteFound)
        if (activiteFound) {
            afficherDat(activiteFound.data)
        }
    })
}

async function ajouterActivites(url, data) {
    await axios.post(url, data)
        .then(res => swal("Ajouter avec succes", "", "success"))
        .catch(err => console.error('il y a un erreru: ', err.message))
}




function remplireFormModifier(event) {
    let idActivite = Number(event.target.dataset.idActivite)

    let activiteFound = activites.find(element => element.id === idActivite)

    if (activiteFound) {
        formAjoute.checkId.value = activiteFound.id
        formAjoute.duree.value = activiteFound.duree
        formAjoute.titre.value = activiteFound.titre
        formAjoute.theme.value = activiteFound.theme
        formAjoute.description.value = activiteFound.description
        formAjoute.objectifs.value = activiteFound.objectifs
    }
}

async function modifierActivite() {
    const id = formAjoute.checkId.value
    let oldData = activites.find(element => element.id == id)

    const donnees = {
        titre: formAjoute.titre.value,
        theme: formAjoute.theme.value,
        objectifs: formAjoute.objectifs.value,
        duree: Number(formAjoute.duree.value),
        description: formAjoute.description.value
    }

    try {
        if (
            oldData.titre === donnees.titre &&
            oldData.theme === donnees.theme &&
            oldData.objectifs === donnees.objectifs &&
            oldData.description === donnees.description &&
            oldData.duree !== donnees.duree
        ) {
            await axios.patch(`${url}/${id}`, {
                duree: donnees.duree
            })

        } else if (
            oldData.titre !== donnees.titre ||
            oldData.theme !== donnees.theme ||
            oldData.objectifs !== donnees.objectifs ||
            oldData.description !== donnees.description ||
            oldData.duree !== donnees.duree
        ) {
            await axios.put(`${url}/${id}`, { ...oldData, ...donnees })

        } else {
            swal("aucune modification!", "", "warning");
            return
        }

        swal("Modifier avec succes", "", "success");
        formAjoute.reset()
        formAjoute.checkId.value = ''
        await getData(url)

    } catch (err) {
        console.error("il y a une erreur: ", err.message)
    }
}


function supprimerActivite(event) {
    console.log('clicked')

    swal({
        title: "Êtes-vous sûr ?",
        text: "Voulez-vous vraiment modifier cette activité ?",
        icon: "warning",
        buttons: ["Annuler", "Confirmer"],
        dangerMode: true
    }).then(async (confirmed) => {
        if (confirmed) {
            let idActivite = Number(event.target.dataset.idActivite)
            console.log(idActivite)
            let activiteFound = activites.find(element => element.id === idActivite)
            console.log(activiteFound)
            if (activiteFound) {
                await axios.delete(`${url}/${idActivite}`).catch(err => console.error("il y a un erreur: ", err.message))
                await getData(url)
            }
        }
    });

}

function validerFormulaire() {
    const duree = Number(formAjoute.duree.value.trim())
    const theme = formAjoute.theme.value.trim()
    const titre = formAjoute.titre.value.trim()
    const description = formAjoute.description.value.trim()
    const objectifs = formAjoute.objectifs.value.trim()

    const themes = ["jeu", "apprentissage", "exercice", "autre"]
    const errors = []

    if (titre.length < 5 || titre.length > 100) {
        errors.push('Le titre doit contenir entre 5 et 100 caractères.')
    }

    if (!themes.includes(theme)) {
        errors.push('Le thème doit être : jeu, apprentissage, exercice, autre.')
    }

    if (!Number.isInteger(duree) || duree < 10 || duree > 20) {
        errors.push('La durée doit être un entier compris entre 10 et 20.')
    }

    if (description.length < 20 || description.length > 1000) {
        errors.push('La description doit contenir entre 20 et 1 000 caractères.')
    }

    if (objectifs.length === 0) {
        errors.push('Les objectifs sont obligatoires.')
    }

    const errorDiv = document.getElementById('error-message')

    if (errors.length > 0) {
        let ul = document.createElement('ul')
        ul.className = 'list-disc pl-5 space-y-1'

        errors.forEach(e => {
            let li = document.createElement('li')
            li.textContent = e
            ul.append(li)
        })
        errorDiv.textContent = ''
        errorDiv.append(ul)
        errorDiv.classList.remove('hidden')
        errorDiv.classList.add('block')
        return false
    }

    errorDiv.textContent = ''
    errorDiv.classList.add('hidden')

    return true
}

document.getElementById('forAjoute').addEventListener('submit', (event) => {
    event.preventDefault()

    if (!validerFormulaire()) {
        return
    }

    if (event.currentTarget.checkId.value === '') {

        const duree = Number(formAjoute.duree.value.trim())
        const theme = formAjoute.theme.value.trim()
        const titre = formAjoute.titre.value.trim()
        const description = formAjoute.description.value.trim()
        const objectifs = formAjoute.objectifs.value.trim()

        let newActivite = {
            titre: titre,
            duree: duree,
            theme: theme,
            auteur: nomAuteur,
            description: description,
            objectifs: objectifs
        }

        ajouterActivites(url, JSON.stringify(newActivite))
        getData(url)
        formAjoute.reset()
        formAjoute.checkId.value = ''

    } else {
        modifierActivite()
    }
})


cardsContainer.addEventListener('click', event => {
    if (event.target.classList.contains('btnSupprimer')) supprimerActivite(event, activites)
    if (event.target.classList.contains('btnModifier')) remplireFormModifier(event, activites)
})




function divCard(data) {

    let article = document.createElement('article')
    article.className = 'ativiteContainer w-full rounded-xl border border-stone-200 bg-white p-4 transition-colors hover:border-stone-300 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-700'


    let input = document.createElement('input')
    input.setAttribute('type', 'checkbox')
    input.setAttribute('id', `details-${data.id}`)
    input.className = 'peer sr-only'


    let divThemDuree = document.createElement('div')
    divThemDuree.className = 'flex items-center justify-between gap-2'
    let spanThem = document.createElement('span')
    spanThem.className = 'rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-200'
    spanThem.textContent = data.theme
    let spanDuree = document.createElement('span')
    spanDuree.className = 'text-xs text-stone-500 dark:text-stone-400'
    spanDuree.textContent = `${data.duree} min`



    let h2Titre = document.createElement('h2')
    h2Titre.className = 'mt-3 line-clamp-2 text-base font-bold leading-snug'
    h2Titre.textContent = data.titre



    let pDescription = document.createElement('p')
    pDescription.className = 'mt-2 line-clamp-3 text-sm text-stone-600 dark:text-stone-400'
    pDescription.textContent = data.description



    let divObjectifAuteur = document.createElement('div')
    divObjectifAuteur.className = 'mt-4 hidden space-y-3 border-t border-stone-200 pt-4 text-sm peer-checked:block dark:border-stone-800'
    let divObjectif = document.createElement('div')
    let pTitreObjectif = document.createElement('p')
    pTitreObjectif.textContent = 'objectifs'
    let pObjectifs = document.createElement('p')
    pObjectifs.textContent = data.objectifs

    let divAuteur = document.createElement('div')
    let pTitreAuteur = document.createElement('p')
    pTitreAuteur.className = 'font-semibold'
    pTitreAuteur.textContent = 'Auteur'
    let pAuteur = document.createElement('p')
    pAuteur.className = 'text-stone-600 dark:text-stone-400'
    pAuteur.textContent = data.auteur



    let divActions = document.createElement('div')
    divActions.className = 'mt-4 flex flex-wrap gap-2'

    let labelInput = document.createElement('label')
    labelInput.className = 'cursor-pointer rounded-lg bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-indigo-500 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-400 peer-focus-visible:ring-offset-2'
    labelInput.setAttribute('for', `details-${data.id}`)
    labelInput.textContent = 'Details'

    let buttonModifier = document.createElement('button')
    buttonModifier.className = 'btnModifier rounded-lg border border-stone-300 px-2.5 py-1 text-xs font-semibold hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800'
    buttonModifier.textContent = 'Modifier'
    buttonModifier.setAttribute('data-id-activite', data.id)
    buttonModifier.setAttribute('data-id-activite', data.id)

    let buttonSuppromer = document.createElement('button')
    buttonSuppromer.className = 'btnSupprimer rounded-lg px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40'
    buttonSuppromer.textContent = 'Supprimer'
    buttonSuppromer.setAttribute('data-id-activite', data.id)
    buttonSuppromer.setAttribute('title', `supprimer ${data.titre}`)

    divObjectifAuteur.append(divObjectif, divAuteur)
    divObjectif.append(pTitreObjectif, pObjectifs)
    divAuteur.append(pTitreAuteur, pAuteur)
    divActions.append(labelInput, buttonModifier, buttonSuppromer)
    divThemDuree.append(spanThem, spanDuree)

    article.append(input, divThemDuree, h2Titre, pDescription, divObjectifAuteur, divActions)
    return article
}