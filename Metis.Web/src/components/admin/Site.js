import React from 'react'
import SiteContainer from '../containers/admin/SiteContainer'
import PageHeader from '../shared/PageHeader'

const STRINGS = {
  SUBTITLE_NEW: 'δημιουργία ιστότοπου',
  SUBTITLE_EDIT: 'επεξεργασία ιστότοπου',
  SAVE: 'Αποθήκευση',
  CANCEL: 'Ακύρωση'
}

const SiteView = ({ site, onSave, onCancel, onBack }) => {
  if (!site) {
    return null
  }
  return (
    <div>
      <PageHeader
        title={site.title}
        subtitle={site.id ? STRINGS.SUBTITLE_EDIT : STRINGS.SUBTITLE_NEW}
        onBack={onBack}
        actions={[
          {
            caption: STRINGS.SAVE,
            onClick: onSave
          },
          {
            caption: STRINGS.CANCEL,
            onClick: onCancel
          }
        ]}
      />
      {JSON.stringify(site)}
    </div>
  )
}

const Site = () => (
  <SiteContainer>
    <SiteView />
  </SiteContainer>
)

export default Site
