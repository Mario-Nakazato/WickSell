export function currency(e: React.FormEvent<HTMLInputElement> | string) {
    let value
    if (e) {
        if (typeof e === 'string') {
            value = e
        } else {
            value = e.currentTarget.value
        }
        value = value.replace(/\D/g, '')
        value = value.replace(/(\d)(\d{2})$/, '$1,$2')
        value = value.replace(/(?=(\d{3})+(\D))\B/g, '.')
        return value
    } else {
        return ''
    }
}

export function percentage(e: React.FormEvent<HTMLInputElement> | string) {
    let value
    if (e) {
        if (typeof e !== 'string') {
            value = e.currentTarget.value
        } else {
            value = e
        }
        value = value.replace(/\D/g, '')
        let amount = parseFloat(value)
        if (amount > 10000) {
            return ''
        }
        value = value.replace(/(\d{6})/, '')
        value = value.replace(/(\d)(\d{2})$/, '$1,$2')
        return value
    } else {
        return ''
    }
}

export function brlMonetary(e: any) {
    if (e) {
        e = e.toString()
        if (e.includes('.')) {
            e = e.replace('.', ',')
            if (e.length < e.indexOf(',') + 3) {
                for (let i = e.length - e.indexOf(',') - 1; i > 0; i--) {
                    e += '0'
                }
            }
        } else {
            if (e.length < 0) {
                e = '0'
            }
            e += ',00'
        }
        e = currency(e)
        e = 'R$ ' + e
        return e

    } else {
        return ''
    }
}

const valuesUtils = { currency, percentage, brlMonetary }
export default valuesUtils