/* eslint-disable @typescript-eslint/naming-convention */
import {
  FileUnknownOutlined,
  FolderOpenOutlined,
  FormOutlined,
} from '@ant-design/icons';
import { Button, message, Select, Space, Table } from 'antd';
import React, { createContext, useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import CodeModal from './code-modal';
import { EditableCell, EditableRow } from './components/edit-row';
import './index.less';

interface DataType {
  key: string | number;
  templateName: string;
  name: string;
  content: string;
  parentKey?: string | number;
  status?: boolean;
  type: 'file' | 'folder';
  children?: DataType[];
}

export const TableContext = createContext<{
  expandKeys: (string | number)[];
  setExpandKeys: React.Dispatch<React.SetStateAction<(string | number)[]>>;
}>({} as any);

const Panel = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [expandKeys, setExpandKeys] = useState<(string | number)[]>([]);
  const modalRef = useRef<Record<string, any>>();

  useEffect(() => {
    const listener = (event) => {
      console.log(event);
      if (
        event.data.type === 'init-template-data' &&
        Array.isArray(event.data.data)
      ) {
        setDataSource(event.data.data);
      }
    };
    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, []);

  const handleAdd = () => {
    const key = Date.now();
    const newData: any = {
      key,
      templateName: `模版_${dataSource.length}`,
      name: `目录结构`,
      content: '',
      type: 'folder',
      children: [
        {
          key: key + 1,
          name: `NAME_0`,
          content: '',
          type: 'file',
          parentKey: key,
        },
      ],
    };

    setDataSource([...dataSource, newData]);
    setExpandKeys([...expandKeys, key]);
  };

  const handleSave = () => {
    setDataSource([...dataSource]);
  };

  const saveUpdate = () => {
    message.success('保存成功');
    vscodePostMessage({
      type: 'save-template-data',
      data: dataSource,
    });
  };

  const defaultColumns: any[] = [
    {
      dataIndex: 'templateName',
      title: '模版名称',
      editable: true,
      width: '250px',
      align: 'center',
      render: (name, record) => (
        <Space>
          {name}
          {!record.parentKey ? (
            <FormOutlined style={{ color: 'rgba(0,0,0,0.2)' }} />
          ) : null}
        </Space>
      ),
    },
    Table.EXPAND_COLUMN,
    {
      dataIndex: 'name',
      title: '目录结构',
      editable: true,
      width: '350px',
      render: (name, record: Record<string, any>) => (
        <a
          style={{
            display: 'inline-block',
            lineHeight: '32px',
            color: record.type === 'file' ? 'rgba(0, 0, 0, 0.85)' : undefined,
            opacity: record.parentKey || record.type === 'file' ? 1 : 0.5,
          }}
        >
          <Space>
            {name}
            {record?.type === 'file' ? (
              <>
                <FileUnknownOutlined />
              </>
            ) : (
              <FolderOpenOutlined style={{ color: '#1890ff' }} />
            )}
            {record.parentKey || record?.type === 'file' ? (
              <FormOutlined style={{ color: 'rgba(0,0,0,0.2)' }} />
            ) : null}
          </Space>
        </a>
      ),
    },
    {
      dataIndex: 'type',
      title: '当前类型',
      align: 'center',
      width: '120px',
      render: (type, record) => {
        return (
          <Select
            defaultValue={type}
            style={{ width: '120px' }}
            onChange={(type) => {
              record.type = type;
              record.children = undefined;
              record.content = '';
              if (!record.parentKey) {
                record.name = record.type === 'file' ? '_NAME' : '目录结构';
              }
              handleSave();
            }}
          >
            <Select.Option key="file" value="file">
              <Space>
                <FileUnknownOutlined />
                文件
              </Space>
            </Select.Option>
            <Select.Option key="folder" value="folder">
              <Space>
                <FolderOpenOutlined />
                文件夹
              </Space>
            </Select.Option>
          </Select>
        );
      },
    },
    {
      dataIndex: 'content',
      title: '模版内容',
      align: 'center',
      width: '120px',
      render: (_, record) =>
        record.type === 'file' ? (
          <a
            onClick={() => {
              modalRef.current?.toggle?.(record);
            }}
          >
            编辑
          </a>
        ) : (
          '-'
        ),
    },
    Table.SELECTION_COLUMN,
  ];

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
        dataSource,
      }),
    };
  });

  return (
    <>
      <div style={{ padding: '20px' }}>
        <CodeModal ref={modalRef} onSaveCallback={handleSave} />
        <Space style={{ margin: '10px 0' }}>
          <Button onClick={handleAdd}>新增模版</Button>
          <Button onClick={saveUpdate} type="primary">
            保存更新
          </Button>
        </Space>
        <TableContext.Provider value={{ expandKeys, setExpandKeys }}>
          <Table
            scroll={{ x: 'max-content' }}
            rowSelection={{}}
            expandable={{
              expandedRowKeys: expandKeys,
              onExpand: (isExpand, record) => {
                setExpandKeys((keysList) => {
                  const set = new Set(keysList);
                  if (isExpand) {
                    set.add(record.key);
                  } else {
                    set.delete(record.key);
                  }
                  return Array.from(set);
                });
              },
            }}
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            key={'key'}
            dataSource={dataSource}
            columns={columns}
          />
        </TableContext.Provider>
      </div>
    </>
  );
};

render(<Panel />, document.querySelector('#root'));
