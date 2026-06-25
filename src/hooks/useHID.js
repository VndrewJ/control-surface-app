import { useState } from 'react'


const REPORT_TYPES = {
    0x10: 'Encoder',
    0x20: 'Button',
    // Add more report types as needed
}

const MAX_REPORTS = 100  // Maximum number of reports to keep in state

// Returns the report type based on the baseID
function getReportType(baseID) {
    return REPORT_TYPES[baseID] ?? 'Unknown'
}

// Parse the report data based on the report type
function parseReport(type, data) {
    const timestamp = new Date().toLocaleTimeString()
    switch (type) {
        case 'Encoder':
            return {
                type: 'Encoder',
                timestamp,
                value1: data.getInt8(0),
                value2: data.getUint8(1)
            }
        case 'Button':
            return {
                type: 'Button',
                timestamp,
                value: data.getUint8(0)
            }
        default:
            console.warn(`Unknown report type: ${type}`)
            return {
                type: 'Unknown',
                timestamp,
            }
        }
}
    

export function useHID() {

    const [connected, setConnected] = useState(false)
    const [device, setDevice] = useState(null)
    const [reports, setReports] = useState([])

    async function handleConnect() {
        // Request the user to select a HID device
        const devices = await navigator.hid.requestDevice({ filters:[{
            vendorId: 0xcafe, // Replace with your device's vendor ID
            productId: 0x4004 // Replace with your device's product ID
        }]})

        if (devices.length > 0) {
            const selectedDevice = devices[0]
            await selectedDevice.open()
            console.log('Device opened:', selectedDevice)
            console.log('Collections:', selectedDevice.collections)
            selectedDevice.addEventListener('inputreport', (event) => {
                console.log('ANY report received, ID:', event.reportId)
                // console.log('Report ID:', event.reportId)
                // console.log('Data:', new Uint8Array(event.data.buffer))
                const type = getReportType(event.reportId & 0xF0) // Mask and get base ID for report type
                const parsedReport = parseReport(type, event.data)
                setReports(prev => [...prev, parsedReport].slice(-MAX_REPORTS))
            })
            //console.log('Event listener attached')
            setDevice(selectedDevice)
            setConnected(true)
        }
    }

    return {
        connected,
        device,
        reports,
        handleConnect
    }
}