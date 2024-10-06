import { Component, createSignal } from 'solid-js'
import { createDropzone } from '@soorria/solid-dropzone'
import Dropzone from './Dropzone'
import { ErrorAlert } from './ErrorAlert'
import { processCsv } from './processCsv'

const App: Component = () => {
  const [error, setError] = createSignal<string | undefined>()
  const onDrop = async (acceptedFiles: File[]) => {
    try {
      setError(null)
      await processCsv(acceptedFiles[0])
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      }
    }
  }
  const dropzone = createDropzone({ onDrop, maxFiles: 1 })

  return (
    <div class="container mx-auto max-w-xl">
      <p class="text-4xl text-blue-800 text-center py-16">G5 Logfile Linter</p>
      <p>
        Fixes GPS date rollover and bogus default Lat/Long coordinates in your log files.
      </p>
      {error() && (
        <ErrorAlert>
          <p>{error()}</p>
        </ErrorAlert>
      )}
      <Dropzone
        className={'py-4'}
        rootProps={dropzone.getRootProps()}
        inputProps={dropzone.getInputProps()}
      />
    </div>
  )
}

export default App
