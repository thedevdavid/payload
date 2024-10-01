'use client'

import {
  Collapsible,
  Form,
  Pill,
  RenderComponent,
  SectionTitle,
  ShimmerEffect,
  useAuth,
  useDocumentInfo,
  useFieldProps,
  useFormSubmitted,
  useServerFunctions,
  useTranslation,
} from '@payloadcms/ui'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

const baseClass = 'lexical-block'
import type { BlocksFieldClient, FormState } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { v4 as uuid } from 'uuid'

import type { BlockFields } from '../../server/nodes/BlocksNode.js'

import { useEditorConfigContext } from '../../../../lexical/config/client/EditorConfigProvider.js'
import { BlockContent } from './BlockContent.js'
import './index.scss'

type Props = {
  readonly children?: React.ReactNode
  readonly formData: BlockFields
  readonly nodeKey: string
}

export const BlockComponent: React.FC<Props> = (props) => {
  const { formData, nodeKey } = props
  const submitted = useFormSubmitted()
  const { id } = useDocumentInfo()
  const { user } = useAuth()
  const { path, schemaPath } = useFieldProps()
  const { field: parentLexicalRichTextField } = useEditorConfigContext()

  const { serverFunction } = useServerFunctions()

  const [initialState, setInitialState] = useState<false | FormState>(false)

  const {
    field: { richTextComponentMap },
  } = useEditorConfigContext()

  const schemaFieldsPath = `${schemaPath}.lexical_internal_feature.blocks.lexical_blocks.lexical_blocks.${formData.blockType}`

  const componentMapRenderedBlockPath = `lexical_internal_feature.blocks.fields.lexical_blocks`
  const blocksField: BlocksFieldClient = richTextComponentMap?.get(componentMapRenderedBlockPath)[0]

  const clientBlock = blocksField.blocks.find((block) => block.slug === formData.blockType)

  const { i18n } = useTranslation()

  // Field Schema
  useEffect(() => {
    const awaitInitialState = async () => {
      const { state } = (await serverFunction({
        name: 'form-state',
        args: {
          id,
          data: formData,
          language: i18n.language,
          operation: 'update',
          schemaPath: schemaFieldsPath,
        },
      })) as { state: FormState } // TODO: remove this when strictNullChecks is enabled and the return type can be inferred

      if (state) {
        state.blockName = {
          initialValue: '',
          passesCondition: true,
          valid: true,
          value: formData.blockName,
        }

        setInitialState(state)
      }
    }

    if (formData) {
      void awaitInitialState()
    }
  }, [serverFunction, schemaFieldsPath, id, user, i18n]) // DO NOT ADD FORMDATA HERE! Adding formData will kick you out of sub block editors while writing.

  const onChange = useCallback(
    async ({ formState: prevFormState }) => {
      const { state: formState } = (await serverFunction({
        name: 'form-state',
        args: {
          id,
          formState: prevFormState,
          language: i18n.language,
          operation: 'update',
          schemaPath: schemaFieldsPath,
        },
      })) as { state: FormState } // TODO: remove this when strictNullChecks is enabled and the return type can be inferred

      formState.blockName = {
        initialValue: '',
        passesCondition: true,
        valid: true,
        value: formData.blockName,
      }

      return formState
    },

    [id, schemaFieldsPath, formData.blockName, serverFunction, i18n],
  )

  const classNames = [`${baseClass}__row`, `${baseClass}__row--no-errors`].filter(Boolean).join(' ')

  // Memoized Form JSX
  const formContent = useMemo(() => {
    return clientBlock && initialState !== false ? (
      <Form
        beforeSubmit={[onChange]}
        fields={clientBlock.fields}
        initialState={initialState}
        onChange={[onChange]}
        submitted={submitted}
        uuid={uuid()}
      >
        <BlockContent
          baseClass={baseClass}
          clientBlock={clientBlock}
          field={parentLexicalRichTextField}
          formData={formData}
          formSchema={clientBlock.fields}
          nodeKey={nodeKey}
          path={`${path}.lexical_internal_feature.blocks.${formData.blockType}`}
          schemaPath={schemaFieldsPath}
        />
      </Form>
    ) : (
      <Collapsible
        className={classNames}
        collapsibleStyle="default"
        header={
          clientBlock?.admin?.components?.Label ? (
            <RenderComponent
              clientProps={{ blockKind: 'lexicalBlock', formData }}
              mappedComponent={clientBlock.admin.components.Label}
            />
          ) : (
            <div className={`${baseClass}__block-header`}>
              <div>
                <Pill
                  className={`${baseClass}__block-pill ${baseClass}__block-pill-${formData?.blockType}`}
                  pillStyle="white"
                >
                  {clientBlock && typeof clientBlock.labels?.singular === 'string'
                    ? getTranslation(clientBlock.labels.singular, i18n)
                    : clientBlock?.slug}
                </Pill>
                <SectionTitle
                  path="blockName"
                  readOnly={parentLexicalRichTextField?.admin?.readOnly || false}
                />
              </div>
            </div>
          )
        }
        key={0}
      >
        <ShimmerEffect height="35vh" />
      </Collapsible>
    )
  }, [
    clientBlock,
    initialState,
    onChange,
    submitted,
    parentLexicalRichTextField,
    nodeKey,
    path,
    schemaFieldsPath,
    classNames,
    i18n,
  ])

  return <div className={baseClass + ' ' + baseClass + '-' + formData.blockType}>{formContent}</div>
}
