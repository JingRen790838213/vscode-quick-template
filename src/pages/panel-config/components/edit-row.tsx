/* eslint-disable @typescript-eslint/naming-convention */
import { Button, Form, Input, InputRef, Space, Switch } from 'antd';
import { FormInstance } from 'rc-field-form';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TableContext } from '..';
import { travelTree } from '../../../utils';

export const EditableContext = React.createContext<FormInstance>({} as any);

export const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

export const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  dataSource,
  ...restProps
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const { setExpandKeys } = useContext(TableContext);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const handleAddChildren = useCallback(() => {
    setLoading(true);

    if (!record.children) {
      record.children = [];
    }
    record.children.push({
      key: Date.now(),
      name: `NAME_${record.children.length}`,
      content: '',
      type: 'file',
      parentKey: record.key,
    });
    handleSave();
    setExpandKeys((keys) => [...keys, record.key]);
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }, [record, handleSave]);

  const handleDelete = () => {
    travelTree(dataSource, record.key, ({ parent, curretnIndex }) => {
      parent.splice(curretnIndex, 1);
    });
    handleSave();
  };

  const hasEditIcon = () => {
    if (!record.parentKey && record.type === 'folder' && dataIndex === 'name') {
      return;
    }
    // 一级以上的模版名称无法编辑
    if (
      record.parentKey &&
      dataIndex === 'templateName' &&
      record.type === 'folder'
    ) {
      return false;
    }
    return editable;
  };

  const toggleEdit = () => {
    if (!hasEditIcon()) {
      return null;
    }
    setEditing(!editing);
    form['setFieldsValue']({
      [dataIndex]: record[dataIndex],
    });
  };

  const onSave = async () => {
    try {
      const values = await form['validateFields']();
      Object.assign(record, values);
      handleSave();
      toggleEdit();
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
          height: '32px',
          overflow: 'hidden',
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: ` `,
          },
        ]}
      >
        <Input
          style={{ width: '120px' }}
          ref={inputRef}
          onPressEnter={onSave}
          onBlur={onSave}
          maxLength={dataIndex === 'templateName' ? 10 : undefined}
        />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" onClick={toggleEdit}>
        {children}
      </div>
    );
  }
  if (!record) {
    return <td {...restProps}>{childNode}</td>;
  }
  return (
    <td {...restProps}>
      <Space style={{ justifyContent: 'space-between', width: '100%' }}>
        {childNode}
        {dataIndex === 'templateName' && !record.parentKey ? (
          <Switch
            checked={record.status}
            checkedChildren="启用"
            unCheckedChildren="禁用"
            onChange={(checked) => {
              record.status = checked;
              handleSave(record);
            }}
          />
        ) : null}
        {dataIndex === 'name' ? (
          <Space>
            <Button
              size="small"
              loading={loading}
              style={{ fontSize: '12px' }}
              hidden={record?.type !== 'folder'}
              onClick={handleAddChildren}
            >
              新增子项
            </Button>
            <Button
              size="small"
              danger
              style={{ fontSize: '12px' }}
              onClick={handleDelete}
            >
              删除
            </Button>
          </Space>
        ) : null}
      </Space>
    </td>
  );
};
