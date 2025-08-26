import './Button.scss'

const Button = (props) => {
  const {
    type,
    onClick,
    children,
  } = props

  return (
    <button
      className="button"
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button