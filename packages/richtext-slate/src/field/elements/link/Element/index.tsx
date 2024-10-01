'use client'
import type { FormState } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import {
  Button,
  Popup,
  Translation,
  useAuth,
  useConfig,
  useDocumentInfo,
  useDrawerSlug,
  useLocale,
  useModal,
  useServerFunctions,
  useTranslation,
} from '@payloadcms/ui'
import { deepCopyObject, reduceFieldsToValues } from 'payload/shared'
import { useCallback, useEffect, useState } from 'react'
import { Editor, Node, Transforms } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'

import type { LinkElementType } from '../types.js'

import { useElement } from '../../../providers/ElementProvider.js'
import { LinkDrawer } from '../LinkDrawer/index.js'
import { linkFieldsSchemaPath } from '../shared.js'
import { unwrapLink } from '../utilities.js'
import './index.scss'

const baseClass = 'rich-text-link'

/**
 * This function is called when an existing link is edited.
 * When a link is first created, another function is called: {@link ../Button/index.tsx#insertLink}
 */
const insertChange = (editor, fields) => {
  const data = reduceFieldsToValues(fields, true)

  const [, parentPath] = Editor.above(editor)

  const newNode: Record<string, unknown> = {
    doc: data.doc,
    linkType: data.linkType,
    newTab: data.newTab,
    url: data.url,
  }

  if (data.fields) {
    newNode.fields = data.fields
  }

  Transforms.setNodes(editor, newNode, { at: parentPath })

  Transforms.delete(editor, { at: editor.selection.focus.path, unit: 'block' })
  Transforms.move(editor, { distance: 1, unit: 'offset' })
  Transforms.insertText(editor, String(data.text), { at: editor.selection.focus.path })

  ReactEditor.focus(editor)
}

export const LinkElement = () => {
  const { attributes, children, editorRef, element, fieldProps, schemaPath } =
    useElement<LinkElementType>()

  const fieldMapPath = `${schemaPath}.${linkFieldsSchemaPath}`

  const {
    field: { richTextComponentMap },
  } = fieldProps
  const fields = richTextComponentMap.get(linkFieldsSchemaPath)

  const editor = useSlate()
  const { config } = useConfig()
  const { user } = useAuth()
  const { code: locale } = useLocale()
  const { i18n, t } = useTranslation()
  const { closeModal, openModal, toggleModal } = useModal()
  const [renderModal, setRenderModal] = useState(false)
  const [renderPopup, setRenderPopup] = useState(false)
  const [initialState, setInitialState] = useState<FormState>({})
  const { id, collectionSlug } = useDocumentInfo()

  const { serverFunction } = useServerFunctions()

  const drawerSlug = useDrawerSlug('rich-text-link')

  const handleTogglePopup = useCallback((render) => {
    if (!render) {
      setRenderPopup(render)
    }
  }, [])

  useEffect(() => {
    const awaitInitialState = async () => {
      const data = {
        doc: element.doc,
        fields: deepCopyObject(element.fields),
        linkType: element.linkType,
        newTab: element.newTab,
        text: Node.string(element),
        url: element.url,
      }

      const { state } = (await serverFunction({
        name: 'form-state',
        args: {
          data,
          language: i18n.language,
          operation: 'update',
          schemaPath: fieldMapPath,
        },
      })) as { state: FormState } // TODO: remove this when strictNullChecks is enabled and the return type can be inferred

      setInitialState(state)
    }

    if (renderModal) {
      void awaitInitialState()
    }
  }, [
    renderModal,
    element,
    user,
    locale,
    t,
    collectionSlug,
    config,
    id,
    fieldMapPath,
    serverFunction,
    i18n,
  ])

  return (
    <span className={baseClass} {...attributes}>
      <span contentEditable={false} style={{ userSelect: 'none' }}>
        {renderModal && (
          <LinkDrawer
            drawerSlug={drawerSlug}
            fields={Array.isArray(fields) ? fields : []}
            handleClose={() => {
              toggleModal(drawerSlug)
              setRenderModal(false)
            }}
            handleModalSubmit={(fields) => {
              insertChange(editor, fields)
              closeModal(drawerSlug)
              setRenderModal(false)
            }}
            initialState={initialState}
          />
        )}
        <Popup
          boundingRef={editorRef}
          buttonType="none"
          forceOpen={renderPopup}
          horizontalAlign="left"
          onToggleOpen={handleTogglePopup}
          render={() => (
            <div className={`${baseClass}__popup`}>
              {element.linkType === 'internal' && element.doc?.relationTo && element.doc?.value && (
                <Translation
                  elements={{
                    '0': ({ children }) => (
                      <a
                        className={`${baseClass}__link-label`}
                        href={`${config.routes.admin}/collections/${element.doc.relationTo}/${element.doc.value}`}
                        rel="noreferrer"
                        target="_blank"
                        title={`${config.routes.admin}/collections/${element.doc.relationTo}/${element.doc.value}`}
                      >
                        {children}
                      </a>
                    ),
                  }}
                  i18nKey="fields:linkedTo"
                  t={t}
                  variables={{
                    label: getTranslation(
                      config.collections.find(({ slug }) => slug === element.doc.relationTo)?.labels
                        ?.singular,
                      i18n,
                    ),
                  }}
                />
              )}
              {(element.linkType === 'custom' || !element.linkType) && (
                <a
                  className={`${baseClass}__link-label`}
                  href={element.url}
                  rel="noreferrer"
                  target="_blank"
                  title={element.url}
                >
                  {element.url}
                </a>
              )}
              <Button
                buttonStyle="icon-label"
                className={`${baseClass}__link-edit`}
                icon="edit"
                onClick={(e) => {
                  e.preventDefault()
                  setRenderPopup(false)
                  openModal(drawerSlug)
                  setRenderModal(true)
                }}
                round
                tooltip={t('general:edit')}
              />
              <Button
                buttonStyle="icon-label"
                className={`${baseClass}__link-close`}
                icon="x"
                onClick={(e) => {
                  e.preventDefault()
                  unwrapLink(editor)
                }}
                round
                tooltip={t('general:remove')}
              />
            </div>
          )}
          size="fit-content"
          verticalAlign="bottom"
        />
      </span>
      <span
        className={[`${baseClass}__popup-toggler`].filter(Boolean).join(' ')}
        onClick={() => setRenderPopup(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setRenderPopup(true)
          }
        }}
        role="button"
        tabIndex={0}
      >
        {children}
      </span>
    </span>
  )
}
