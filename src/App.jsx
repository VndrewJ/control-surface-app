import './App.css'
import { useHID } from './hooks/useHID'

function App() {
  const { connected, reports, handleConnect } = useHID()

  return (
    <div className="App">
      <main>
        <div className="title">
          <h1>Modular Control Surface App</h1>
        </div>
      </main>

      <button onClick={handleConnect}>connect</button>
      <div className="connected-status">
        {connected ? <p>Connected</p> : <p>Not connected</p>}
      </div>

      <div className="reports">
        <h2>Reports</h2>
        {reports.map((report, index) => (
          report.type === 'Encoder' ? (
            <div key={index}>
              <p>Type: {report.type}</p>
              <p>Timestamp: {report.timestamp}</p>
              <p>Value 1: {report.value1}</p>
              <p>Value 2: {report.value2}</p>
            </div>
          ) : report.type === 'Button' ? (
            <div key={index}>
              <p>Type: {report.type}</p>
              <p>Timestamp: {report.timestamp}</p>
              <p>Value: {report.value}</p>
            </div>
          ) : (
            <div key={index}>
              <p>Type: {report.type}</p>
              <p>Timestamp: {report.timestamp}</p>
            </div>
          )
        ))}
      </div>
    </div>
  )
}

export default App
