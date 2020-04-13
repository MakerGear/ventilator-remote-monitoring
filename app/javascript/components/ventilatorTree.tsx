import React, { Component } from "react"
import Jsona from 'jsona'
import { get } from '../api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import Organization from "./organization"

import "./ventilatorTree.scss"


interface IProps {
  // If true, all ventilators will generate random data every 3 seconds
  demo: boolean
}

interface IState {
  loading: boolean
  organization: any
  errMsg: string
}

class VentilatorTree extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      loading: true,
      organization: {},
      errMsg: ''
    }
  }

  async componentDidMount() {
    let response = await get<any>('/api/v1/ventilators')

    if (response.ok) {
      // todo: try-catch
      const dataFormatter = new Jsona()
      const organization = dataFormatter.deserialize(response.parsedBody)
      this.setState({
        loading: false,
        organization
      })
    } else {
      this.setState({
        loading: false,
        errMsg: response.errMsg
      })
    }
  }

  render() {
    const { loading, organization, errMsg } = this.state
    const { demo } = this.props

    const spinner = (
      <FontAwesomeIcon icon={faSpinner} size="4x" spin />
    )

    if (loading) {
      return spinner
    }

    if (errMsg) {
      return (<div className="error">{errMsg}</div>)
    }

    return (
      <section>
        <Organization organization={organization} demo={demo} />
      </section>
    )
  }
}

export default VentilatorTree