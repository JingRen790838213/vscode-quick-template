import { commonPropsMatch, componentMatch } from './constants';

export function convertContentToTabelColumn(content: string) {
  if (typeof content !== 'string' || !content) {
    return null;
  }
  const prefix = /(\s*- |\s*\d+\. |^)/.exec(content)?.[0];
  if (!prefix) {
    return '';
  }

  let prefixReg = new RegExp(`^${prefix}`);
  if (prefix.indexOf('.') !== -1) {
    prefixReg = new RegExp(
      `^${prefix}`.replace(/\d+/, '\\d+').replace('.', '\\.'),
    );
  }

  const contentStr = content
    .split(/\n/)
    .filter((str) => prefixReg.test(str) && str)
    .map((str) => {
      const reg = /(\s*- |\s*\d+\. |^)(.*?)(:(.*)|：(.*)|$)/;
      if (reg.exec(str)?.[2]) {
        const title = reg.exec(str)?.[2] ?? '';
        return JSON.stringify({ dataIndex: `_${title}`, title: title.trim() });
      }
    })
    .join(',');
  return contentStr ? `${contentStr},` : contentStr;
}

export function convertToFormComponentObject(label: string, desc: string) {
  const name = `_${label}`;
  const commonTemplatePropsList = commonPropsMatch
    .filter(({ match }) => {
      let checkMatch = false;
      match.forEach((key) => {
        checkMatch = checkMatch || desc.indexOf(key) !== -1;
      });
      return checkMatch;
    })
    .map((item) => item.template);
  const { template, matchItemProps } = componentMatch
    .filter(({ match }) => {
      let checkMatch = false;
      match.forEach((key) => {
        checkMatch = checkMatch || desc.indexOf(key) !== -1;
      });
      return checkMatch;
    })
    .slice(-1)?.[0] || { template: { type: 'input', name } };

  const templateTemp = { ...template };

  if (matchItemProps) {
    if (templateTemp.itemProps) {
      Object.assign(templateTemp.itemProps, matchItemProps(desc));
    } else {
      Object.assign(templateTemp, { itemProps: matchItemProps(desc) });
    }
    // textArea input转换
    console.log(templateTemp);
    if (
      templateTemp.type === 'input' &&
      ((templateTemp?.itemProps as any)?.maxLength as number) >= 50
    ) {
      templateTemp.type = 'textArea';
      if (templateTemp.itemProps) {
        Object.assign(templateTemp.itemProps, { rows: 3 });
      }
    }
  }

  return Object.assign(
    { label, name },
    templateTemp,
    ...commonTemplatePropsList,
  );
}

export function convertContentToJsonFormItem(content: string) {
  if (typeof content !== 'string' || !content) {
    return null;
  }

  const prefix = /(\s*- |\s*\d+\. |^)/.exec(content)?.[0];
  if (!prefix) {
    return '';
  }

  let prefixReg = new RegExp(`^${prefix}`);
  if (prefix.indexOf('.') !== -1) {
    prefixReg = new RegExp(
      `^${prefix}`.replace(/\d+/, '\\d+').replace('.', '\\.'),
    );
  }

  const contentStr = content
    .split(/\n/)
    .filter((str) => prefixReg.test(str) && str)
    .map((str) => {
      const reg = /(\s*- |\s*\d+\. |^)(.*?)(:(.*)|：(.*)|$)/;
      if (reg.exec(str)?.[2]) {
        const label = reg.exec(str)?.[2] ?? '';
        const desc = reg.exec(str)?.[3] ?? '';
        return JSON.stringify(
          convertToFormComponentObject(label, desc),
        ).replace(/\"<><\/>\"/g, '<></>');
      }
    })
    .join(',');
  return contentStr ? `${contentStr},` : contentStr;
}

export function convertContentToOptionList(content: string) {
  if (typeof content !== 'string' || !content) {
    return '';
  }

  if (content.split(/\n/).length > 1) {
    const prefix = /(\s*- |\s*\d+\. |^)/.exec(content)?.[0];
    if (!prefix) {
      return '';
    }

    let prefixReg = new RegExp(`^${prefix}`);
    if (prefix.indexOf('.') !== -1) {
      prefixReg = new RegExp(
        `^${prefix}`.replace(/\d+/, '\\d+').replace('.', '\\.'),
      );
    }
    const constntStr = content
      .split(/\n/)
      .filter((str) => prefixReg.test(str) && str)
      .map((str) => {
        const reg = /(\s*- |\s*\d+\. |^)(.*?)(:(.*)|：(.*)|$)/;
        if (reg.exec(str)?.[2]) {
          const label = reg.exec(str)?.[2] ?? '';
          return JSON.stringify({ value: `_${label}`, label });
        }
      })
      .join(',');
    return constntStr ? `${constntStr},` : constntStr;
  } else if (content.split(/、/).length > 1) {
    const constntStr = content
      .trim()
      .split(/、/)
      .map((item) => JSON.stringify({ value: `_${item}`, label: item }))
      .join(',');
    return constntStr ? `${constntStr},` : constntStr;
  }
  return content;
}

export function convertContentToCustom(content: string, format: string) {
  if (typeof content !== 'string' || !content) {
    return null;
  }
  let formatList: any = [];
  console.log(content);

  if (content.split(/\n/).length > 1) {
    // const prefix = /(\s*\-\s*|\d+\.\s*|^)/.exec(content)?.[0];
    const prefix = /(\s*- |\s*\d+\. |^)/.exec(content)?.[0];
    if (!prefix) {
      return '';
    }

    let prefixReg = new RegExp(`^${prefix}`);
    if (prefix.indexOf('.') !== -1) {
      prefixReg = new RegExp(
        `^${prefix}`.replace(/\d+/, '\\d+').replace('.', '\\.'),
      );
    }

    formatList = content
      .split(/\n/)
      .filter((str) => prefixReg.test(str) && str)
      .map((str) => {
        const reg = /(\s*- |\s*\d+\. |^)(.*?)(:(.*)|：(.*)|$)/;
        if (reg.exec(str)?.[2]) {
          const label = reg.exec(str)?.[2] ?? '';
          return format.replace(/\$label/g, label);
        }
      });
  } else if (content.split(/、/).length > 1) {
    formatList = content
      .trim()
      .split(/、/)
      .map((label) => {
        return format.replace(/\$label/g, label);
      });
  }

  if (/^<.*>$/.test(format)) {
    return formatList.join('');
  } else {
    const contentStr = formatList.join(',');
    return contentStr ? `${contentStr},` : '';
  }
}
