import fp from 'fastify-plugin';
import chokidar from 'chokidar';
import { FastifyInstance } from 'fastify';

interface StateOptions {
  development: boolean
  watchPaths?: string[]
}

export default fp(async (fastify: FastifyInstance, opts: StateOptions) => {
  const development = process.env.NODE_ENV === 'development' || opts.development

  if (development) {
    const watcher = chokidar.watch(opts.watchPaths || ['**/*.ts'], {
      ignored: [
        /(^|[\/\\])\../, 
        /node_modules/,
        /dist/,
        /build/
      ],
      persistent: true
    })

    watcher.on('change', (path) => {
      console.log(`File ${path} has been changed`)
      Object.keys(require.cache).forEach(function(id) {
        delete require.cache[id]
      })
      
      process.send?.('restart')
    })

    fastify.addHook('onClose', async () => {
      await watcher.close()
    })
  }
}, {
  name: 'fastify-state-handler'
})