import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import api from '../../services/api'

const LogBookEntryContainer = props => {
    const { id, eventId } = props.match.params
    const { children, history } = props
    const [logBookEntry, setLogBookEntry] = useState(null)
    const [members, setMembers] = useState([])

    async function onSave() {
        if (!logBookEntry.id) {
            const created = await api.post(`/api/logbooks/${id}/entries`, logBookEntry)
            history.push(`/logbooks/${id}`)
            // if (created) {
            //     history.push(`/logbooks/${id}/event/${created.id}`)
            // }
        } else {
            const saved = await api.put(`/api/logbooks/${id}/entries/${logBookEntry.id}`, logBookEntry)
            history.push(`/logbooks/${id}`)
        }
    }

    function onBack() {
        history.push(`/logbooks/${id}`)
    }

    function onCancel() {
        onBack()
    }

    const logBookHandler = newValue => {
        setLogBookEntry({ ...newValue })
    }


    async function onDelete() {
        await api.delete(`/api/logbooks/${id}/entries/${logBookEntry.id}`)
        history.push(`/logbooks/${id}`)
    }


    useEffect(() => {
        async function fetchNewLogBookEntry() {
            const response = await api.get(`/api/logbooks/${id}/entries/${eventId}`)
            setLogBookEntry(response)
        }
        async function fetchMembers() {
            const response = await api.get(`/api/logbooks/members/${id}`)
            setMembers(response)
        }
        fetchNewLogBookEntry()
        fetchMembers()
    }, [])
    return (React.Children.map(children, child =>
        React.cloneElement(child, {
            logBookEntry,
            members,
            onCancel,
            onSave,
            onDelete,
            logBookHandler
        })
    )
    );
};

export default withRouter(LogBookEntryContainer);