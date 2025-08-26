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
      <label htmlFor={id}>{label}</label>
      <input
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