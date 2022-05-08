import cPerfil from "./cperfil"

const cperfil = new cPerfil(process.env.MONGODB_COLLECTION_PERFIL!)

export default class Perfil {
    private perfil: any

    async setPerfil(sub: string) {
        const email = await cperfil.setEmail(sub)
        this.perfil = await cperfil.findOnePerfil()
        return { email: email, perfil: this.perfil }
    }

    async insertOnePerfil(perfil: {}) {
        await cperfil.insertOnePerfil(perfil)
        this.perfil = perfil
    }

    async updateOnePerfil(perfil: {}) {
        await cperfil.updateOnePerfil(perfil)
        this.perfil = perfil
    }

    async replaceOnePerfil(perfil: {}) {
        await cperfil.replaceOnePerfil(perfil)
        this.perfil = perfil
    }

    async deleteOnePerfil() {
        await cperfil.deleteOnePerfil()
        this.perfil = undefined
    }
}