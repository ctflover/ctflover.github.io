import { Divider, DividerVertical } from 'components/universal/Divider'
import { MdiClockOutline, MdiFountainPenTip } from 'components/universal/Icons'
import { RelativeTime } from 'components/universal/RelativeTime'
import Link from 'next/link'
import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { apiClient } from 'utils'

import type { NoteModel, Pager } from '@mx-space/api-client'
import type { TopicModel } from '@mx-space/api-client/types/models/topic'

export const InnerTopicDetail: FC<{ topic: TopicModel }> = (props) => {
  const { topic } = props
  const { id: topicId } = topic

  const [notes, setNotes] = useState([] as NoteModel[])
  const [pagination, setPagination] = useState<Pager>()

  useEffect(() => {
    apiClient.note.getNoteByTopicId(topicId, 1, 1).then((res) => {
      const { data, pagination } = res

      setNotes(data)
      setPagination(pagination)
    })
  }, [topicId])

  return (
    <div role={'dialog'} className="flex flex-col">
      <Link href={`/notes/topics/${topic.slug}`}>
        <a>
          <h1 className="text-lg font-medium !m-0 py-2">{topic.name}</h1>
        </a>
      </Link>
      <Divider />
      <p className="break-all line-clamp-2 text-gray-2">{topic.introduce}</p>
      <Divider />
      <p className="text-gray-1">{topic.description}</p>
      {notes[0] && (
        <>
          <Divider />
          <p className="flex items-center">
            <MdiClockOutline />
            <DividerVertical />
            最近更新
            <DividerVertical />
            {notes[0]?.title}（
            {
              <RelativeTime
                date={notes[0].modified || notes[0].created}
                displayAbsoluteTimeAfterDay={Infinity}
              />
            }
            ）
          </p>
        </>
      )}
      <Divider />
      <p className="flex items-center">
        <MdiFountainPenTip />
        <DividerVertical />
        共有文章：
        {pagination?.total} 篇
      </p>
    </div>
  )
}
