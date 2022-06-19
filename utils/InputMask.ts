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
    }else{
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
    }else{
        return ''
    }
}
const InputMask = { currency, percentage }
export default InputMask