import React, { Component } from "react"
import { ICluster } from '../types'
import Ventilator from './ventilator'

interface IProps {
  cluster: ICluster
  demo: boolean
}

class Cluster extends Component<IProps, null> {
  render() {
    const { cluster, demo } = this.props

    let section = this.getSection(cluster, demo)

    let result = (
      <React.Fragment>
        <h4>
          {cluster.name}
        </h4>
        {section}
      </React.Fragment>
    )

    return result
  }

  getSection = (cluster: ICluster, demo: boolean) : JSX.Element => {
    if (cluster.ventilators.length == 0) {
      return (
        <h6>
          This cluster has no ventilators.
        </h6>
      )
    }

    // take only the ventilators with hostnames
    let ventilators = cluster.ventilators.filter(v => v.hostname)

    if (ventilators.length == 0) {
      return (
        <h6>
          There are ventilator in this cluster,
          but none of them have been configured
          with a hostname.
        </h6>
      )
    }

    return (
      <table className="table demo-ventilator-table">
        <thead>
          <tr className="tr-heading">
            <th></th>
            <th>Unit</th>
            <th>Tidal Volume </th>
            <th>Respiratory Rate</th>
            <th>Peak Inspiratory Press.</th>
            <th>I/E Ratio</th>
            <th>PEEP</th>
          </tr>
          <tr className="tr-subheading">
            <th></th>
            <th></th>
            <th>mL/Breath</th>
            <th>breaths/min</th>
            <th>cm H2O</th>
            <th></th>
            <th>cm H2O</th>
          </tr>
        </thead>
        <tbody>
          {
            ventilators.map((v, i) => (
              <Ventilator key={i} ventilator={v} demo={demo}/>
            ))
          }
        </tbody>
      </table>
    )
  }
}

export default Cluster