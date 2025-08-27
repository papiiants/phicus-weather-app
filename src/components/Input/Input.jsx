import './Input.scss'

const Input = (props) => {
  const {
    type,
    name,
    label,
    placeholder,
    value,
    id,
    onChange
  } = props

  return (
    <div
      className='input'
    >
      <label className="input__label" htmlFor={id}>{label}</label>
      <input
        className="input__action"
        id={id}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

export default Input