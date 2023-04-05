# This file is generated by Nx.
#
# Build the docker image with `npx nx docker-build webtools`.
# Tip: Modify "docker-build" options in project.json to change docker build args.
#
# Run the container with `docker run -p 3000:3000 -t webtools`.
FROM docker.io/node:lts-alpine

ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app

RUN addgroup --system webtools && \
          adduser --system -G webtools webtools

COPY dist/webtools webtools
RUN chown -R webtools:webtools .

# You can remove this install step if you build with `--bundle` option.
# The bundled output will include external dependencies.
RUN npm --prefix webtools --omit=dev -f install

CMD [ "node", "webtools" ]