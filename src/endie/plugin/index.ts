import { PluginCreator, PluginPost, PluginPre } from './types'

const setProps = (
  creator: PluginCreator<{}, {}, {}, any, any, any, false, boolean, boolean>,
  props?: any,
) => {
  delete creator.setProps
  const _creator = creator as PluginCreator<{}, {}, {}, any, any, any, true, boolean, boolean>
  _creator.props = props
  return _creator
}

const setPre = (
  creator: PluginCreator<{}, {}, {}, any, any, any, boolean, false, boolean>,
  pre?: PluginPre,
) => {
  delete creator.setPre
  const _creator = creator as PluginCreator<{}, {}, {}, any, any, any, boolean, true, boolean>
  _creator.pre = pre
  return _creator
}

const setPost = (
  creator: PluginCreator<{}, {}, {}, any, any, any, boolean, boolean, false>,
  post?: PluginPost,
) => {
  delete creator.setPost
  const _creator = creator as PluginCreator<{}, {}, {}, any, any, any, boolean, boolean, true>
  _creator.post = post
  return _creator
}

export const createPlugin = (): PluginCreator<{}, {}, {}, {}, undefined, undefined, false, false, false> => {
  let creator: PluginCreator<{}, {}, {}, {}, undefined, undefined, false, false, false>
  return creator = {
    setProps: props => setProps(creator, props) as any,
    setPre: pre => setPre(creator, pre) as any,
    setPost: post => setPost(creator, post) as any,
    build: () => {
      const _creator = creator as PluginCreator<any, any, any, any, any, any, boolean, boolean, boolean>
      return {
        props: _creator.props,
        pre: _creator.pre,
        post: _creator.post,
      }
    },
  }
}
