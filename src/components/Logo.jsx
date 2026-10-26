import Icon from './Icon'

export default function Logo() {
  return (
    <div className="logo">
      <span className="logo__mark">
        <Icon name="tooth" size={24} />
      </span>
      <span>
        <strong className="logo__name">Sonrisa</strong>
        <span className="logo__caption">Clínica dental</span>
      </span>
    </div>
  )
}
